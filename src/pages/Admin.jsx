import { useState, useCallback } from 'react'

const CATEGORIES = [
  "2025 Big East Men's Basketball Championship",
  "2025 CUNYAC Men's Championship",
  "Curtis High School Boys Basketball Media Day 2025",
  "High School Football",
  "Japan",
  "Liam Murphy x Chris Ledlum Basketball Camp",
  "Nike NYvsNY Focus 2025",
  "Staten Island Hoops",
]

function UploadZone({ folder, password, onDone }) {
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState([])
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)

  const addFiles = (newFiles) => {
    const filtered = Array.from(newFiles).filter(f => f.type.startsWith('image/'))
    setFiles(prev => [...prev, ...filtered])
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [])

  const handleUpload = async () => {
    if (!files.length) return
    setUploading(true)
    setProgress(files.map(() => 'waiting'))

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setProgress(p => { const n = [...p]; n[i] = 'uploading'; return n })
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': file.type,
            'x-admin-password': password,
            'x-folder-name': folder,
            'x-file-name': file.name,
          },
          body: file,
        })
        if (!res.ok) throw new Error(await res.text())
        setProgress(p => { const n = [...p]; n[i] = 'done'; return n })
      } catch (err) {
        setProgress(p => { const n = [...p]; n[i] = 'error'; return n })
      }
    }
    setUploading(false)
    onDone()
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input').click()}
        className={`border-2 border-dashed rounded-none p-12 text-center cursor-pointer transition-colors ${
          dragging ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
        }`}
      >
        <p className="text-[11px] font-light tracking-[0.2em] uppercase text-gray-400">
          Drag photos here or click to select
        </p>
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between text-[11px] font-light tracking-wide">
              <span className="truncate text-gray-700 max-w-xs">{f.name}</span>
              <span className={`ml-4 shrink-0 ${
                progress[i] === 'done' ? 'text-green-600' :
                progress[i] === 'error' ? 'text-red-500' :
                progress[i] === 'uploading' ? 'text-blue-500' :
                'text-gray-400'
              }`}>
                {progress[i] === 'done' ? '✓' :
                 progress[i] === 'error' ? '✗' :
                 progress[i] === 'uploading' ? '…' : '—'}
              </span>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && !uploading && (
        <button
          onClick={handleUpload}
          className="w-full py-3 text-[11px] font-light tracking-[0.2em] uppercase bg-black text-white hover:opacity-70 transition-opacity"
        >
          Upload {files.length} photo{files.length !== 1 ? 's' : ''} to "{folder}"
        </button>
      )}
    </div>
  )
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState(CATEGORIES[0])
  const [successMsg, setSuccessMsg] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    // Quick verify against the API
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'image/jpeg',
        'x-admin-password': password,
        'x-folder-name': 'test',
        'x-file-name': 'test.jpg',
      },
      body: new Blob([], { type: 'image/jpeg' }),
    })
    // 401 = wrong password, anything else (even 400) = correct password
    if (res.status === 401) {
      setAuthError(true)
    } else {
      setAuthenticated(true)
      setAuthError(false)
    }
  }

  const handleDone = () => {
    setSuccessMsg(`Photos uploaded to "${selectedFolder}"! The site will reflect changes immediately.`)
    setTimeout(() => setSuccessMsg(''), 5000)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-xs font-light tracking-[0.3em] uppercase text-black mb-2">Mark Militar</h1>
            <p className="text-[11px] font-light tracking-[0.15em] uppercase text-gray-400">Portfolio Admin</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full border border-gray-200 px-4 py-3 text-[13px] font-light tracking-wide outline-none focus:border-black transition-colors"
            />
            {authError && (
              <p className="text-red-500 text-[11px] font-light tracking-wide">Incorrect password</p>
            )}
            <button
              type="submit"
              className="w-full py-3 text-[11px] font-light tracking-[0.2em] uppercase bg-black text-white hover:opacity-70 transition-opacity"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-10 py-6 border-b border-gray-100">
        <span className="text-xs font-light tracking-[0.2em] uppercase text-black">Mark Militar — Admin</span>
        <button
          onClick={() => setAuthenticated(false)}
          className="text-[11px] font-light tracking-[0.15em] uppercase text-gray-400 hover:text-black transition-colors"
        >
          Sign Out
        </button>
      </header>

      <main className="pt-32 px-10 pb-20 max-w-2xl mx-auto space-y-12">
        <div>
          <h2 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-2">Upload Photos</h2>
          <p className="text-[12px] font-light text-gray-400 mb-8">
            Select a category, drag in your photos, then click Upload. Images appear on the live site immediately.
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-light tracking-[0.2em] uppercase text-gray-400 mb-2">
                Category
              </label>
              <select
                value={selectedFolder}
                onChange={e => setSelectedFolder(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-[13px] font-light tracking-wide outline-none focus:border-black transition-colors appearance-none bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <UploadZone
              key={selectedFolder}
              folder={selectedFolder}
              password={password}
              onDone={handleDone}
            />
          </div>
        </div>

        {successMsg && (
          <div className="border border-black px-6 py-4 text-[12px] font-light tracking-wide text-black">
            {successMsg}
          </div>
        )}

        <div>
          <h2 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-4">Categories</h2>
          <div className="space-y-2">
            {CATEGORIES.map(cat => (
              <div key={cat} className="text-[12px] font-light text-gray-600 py-2 border-b border-gray-100">
                {cat}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
