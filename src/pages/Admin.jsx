import { useState, useCallback, useEffect } from 'react'

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
    e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files)
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
            'x-folder-name': `mark-portfolio/${folder}`,
            'x-file-name': file.name,
          },
          body: file,
        })
        if (!res.ok) throw new Error(await res.text())
        setProgress(p => { const n = [...p]; n[i] = 'done'; return n })
      } catch {
        setProgress(p => { const n = [...p]; n[i] = 'error'; return n })
      }
    }
    setUploading(false)
    setFiles([])
    onDone()
  }

  const color = (s) => s === 'done' ? 'text-green-600' : s === 'error' ? 'text-red-500' : s === 'uploading' ? 'text-blue-500' : 'text-gray-400'
  const icon = (s) => s === 'done' ? '✓' : s === 'error' ? '✗' : s === 'uploading' ? '…' : '—'

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById(`file-input-${folder}`).click()}
        className={`border-2 border-dashed p-16 text-center cursor-pointer transition-colors ${dragging ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}
      >
        <p className="text-[11px] font-light tracking-[0.2em] uppercase text-gray-400">Drag photos here or click to select</p>
        <input id={`file-input-${folder}`} type="file" multiple accept="image/*" className="hidden" onChange={(e) => addFiles(e.target.files)} />
      </div>

      {files.length > 0 && (
        <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-100 p-3">
          {files.map((f, i) => (
            <div key={i} className="flex justify-between text-[11px] font-light">
              <span className="truncate text-gray-700 max-w-xs">{f.name}</span>
              <span className={`ml-4 shrink-0 ${color(progress[i])}`}>{icon(progress[i])}</span>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && !uploading && (
        <button onClick={handleUpload} className="w-full py-3 text-[11px] font-light tracking-[0.2em] uppercase bg-black text-white hover:opacity-70 transition-opacity">
          Upload {files.length} photo{files.length !== 1 ? 's' : ''} to "{folder}"
        </button>
      )}
      {uploading && <p className="text-center text-[11px] font-light tracking-[0.2em] uppercase text-gray-400 py-3">Uploading… please wait</p>}
    </div>
  )
}

export default function Admin() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [authError, setAuthError] = useState(false)
  const [tab, setTab] = useState('upload') // 'upload' | 'categories'
  const [categories, setCategories] = useState([])
  const [selectedFolder, setSelectedFolder] = useState('')
  const [newCatName, setNewCatName] = useState('')
  const [creating, setCreating] = useState(false)
  const [msg, setMsg] = useState('')

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(''), 5000) }

  const loadCategories = async (pw) => {
    try {
      const res = await fetch('/api/categories', { headers: { 'x-admin-password': pw } })
      const data = await res.json()
      if (data.folders) {
        setCategories(data.folders)
        if (!selectedFolder && data.folders.length > 0) setSelectedFolder(data.folders[0])
      }
    } catch {}
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    // Test auth with a lightweight call
    const res = await fetch('/api/categories', { headers: { 'x-admin-password': password } })
    if (res.status === 401) { setAuthError(true); return }
    setAuthenticated(true)
    setAuthError(false)
    loadCategories(password)
  }

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ name: newCatName.trim() }),
      })
      if (!res.ok) throw new Error()
      showMsg(`✓ Category "${newCatName.trim()}" created! It will appear on the site once you upload photos to it.`)
      setNewCatName('')
      await loadCategories(password)
    } catch {
      showMsg('✗ Failed to create category. Try again.')
    }
    setCreating(false)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center">
            <h1 className="text-xs font-light tracking-[0.3em] uppercase text-black">Mark Militar</h1>
            <p className="text-[11px] font-light tracking-[0.15em] uppercase text-gray-400 mt-1">Portfolio Admin</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
              className="w-full border border-gray-200 px-4 py-3 text-[13px] font-light outline-none focus:border-black transition-colors" />
            {authError && <p className="text-red-500 text-[11px] font-light tracking-wide">Incorrect password</p>}
            <button type="submit" className="w-full py-3 text-[11px] font-light tracking-[0.2em] uppercase bg-black text-white hover:opacity-70 transition-opacity">
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
        <button onClick={() => setAuthenticated(false)} className="text-[11px] font-light tracking-[0.15em] uppercase text-gray-400 hover:text-black transition-colors">Sign Out</button>
      </header>

      <main className="pt-32 px-10 pb-20 max-w-2xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-8 mb-12 border-b border-gray-100">
          {[['upload', 'Upload Photos'], ['categories', 'Manage Categories']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`pb-4 text-[11px] font-light tracking-[0.2em] uppercase transition-colors ${tab === key ? 'text-black border-b-2 border-black -mb-px' : 'text-gray-400 hover:text-black'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* Upload Tab */}
        {tab === 'upload' && (
          <div className="space-y-8">
            <div>
              <p className="text-[12px] font-light text-gray-400 mb-6">Pick a category, drag in your photos, then click Upload. Images go live immediately.</p>
              <label className="block text-[10px] font-light tracking-[0.2em] uppercase text-gray-400 mb-2">Category</label>
              <select value={selectedFolder} onChange={e => setSelectedFolder(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-[13px] font-light outline-none focus:border-black transition-colors appearance-none bg-white">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            {selectedFolder && (
              <UploadZone key={selectedFolder} folder={selectedFolder} password={password}
                onDone={() => showMsg(`✓ Photos uploaded to "${selectedFolder}". Live on site now.`)} />
            )}
          </div>
        )}

        {/* Categories Tab */}
        {tab === 'categories' && (
          <div className="space-y-12">
            {/* Create new */}
            <div>
              <h2 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-2">Create New Category</h2>
              <p className="text-[12px] font-light text-gray-400 mb-6">
                Type the name of the new shoot or project. After creating it, go to "Upload Photos" and upload photos to it.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCreateCategory()}
                  placeholder="e.g. Nike Summer 2025"
                  className="flex-1 border border-gray-200 px-4 py-3 text-[13px] font-light outline-none focus:border-black transition-colors"
                />
                <button onClick={handleCreateCategory} disabled={creating || !newCatName.trim()}
                  className="px-6 py-3 text-[11px] font-light tracking-[0.2em] uppercase bg-black text-white hover:opacity-70 transition-opacity disabled:opacity-30">
                  {creating ? '…' : 'Create'}
                </button>
              </div>
            </div>

            {/* Existing categories */}
            <div>
              <h2 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-6">Existing Categories ({categories.length})</h2>
              <div className="space-y-0">
                {categories.map((cat, i) => (
                  <div key={cat} className="flex items-center justify-between py-4 border-b border-gray-100">
                    <span className="text-[13px] font-light text-gray-800">{cat}</span>
                    <button
                      onClick={() => { setSelectedFolder(cat); setTab('upload') }}
                      className="text-[11px] font-light tracking-[0.15em] uppercase text-gray-400 hover:text-black transition-colors">
                      Upload Photos →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {msg && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-8 py-4 text-[12px] font-light tracking-wide">
            {msg}
          </div>
        )}
      </main>
    </div>
  )
}
