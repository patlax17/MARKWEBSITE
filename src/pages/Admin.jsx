import { useState, useEffect, useRef } from 'react'

const SEED_CATEGORIES = [
  "2025 Big East Men's Basketball Championship",
  "2025 CUNYAC Men's Championship",
  "Curtis High School Boys Basketball Media Day 2025",
  "High School Football",
  "Japan",
  "Liam Murphy x Chris Ledlum Basketball Camp",
  "Nike NYvsNY Focus 2025",
  "Staten Island Hoops",
]

// ─── Drag-to-reorder list (for categories) ────────────────────────────────────

function SortableList({ items, renderItem, onReorder }) {
  const dragIndex = useRef(null)
  const [list, setList] = useState(items)
  useEffect(() => setList(items), [items])

  const handleDragStart = (i) => { dragIndex.current = i }
  const handleDragOver  = (e, i) => {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === i) return
    const next = [...list]
    const [moved] = next.splice(dragIndex.current, 1)
    next.splice(i, 0, moved)
    dragIndex.current = i
    setList(next)
  }
  const handleDrop = () => { onReorder(list); dragIndex.current = null }

  return (
    <ul className="space-y-2">
      {list.map((item, i) => (
        <li key={typeof item === 'object' ? (item.publicId || i) : (item + i)}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={handleDrop}
          className="flex items-center gap-4 p-3 border border-gray-100 bg-white cursor-grab active:cursor-grabbing hover:border-gray-300 transition-colors select-none"
        >
          <span className="text-gray-300 text-lg shrink-0">⠿</span>
          {renderItem(item, i)}
        </li>
      ))}
    </ul>
  )
}

// ─── Masonry drag-to-reorder (for home page photos) ──────────────────────────

function MasonryReorder({ images, onReorder }) {
  const dragIndex = useRef(null)
  const [list, setList] = useState(images)

  useEffect(() => setList(images), [images])

  const handleDragStart = (e, i) => {
    dragIndex.current = i
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, i) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragIndex.current === null || dragIndex.current === i) return
    const next = [...list]
    const [moved] = next.splice(dragIndex.current, 1)
    next.splice(i, 0, moved)
    dragIndex.current = i
    setList(next)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    onReorder(list)
    dragIndex.current = null
  }

  return (
    <div className="masonry-grid">
      {list.map((img, i) => (
        <div
          key={img.publicId}
          draggable
          onDragStart={(e) => handleDragStart(e, i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDrop={handleDrop}
          className="masonry-item group select-none relative"
          style={{ cursor: 'grab' }}
        >
          <img
            src={img.url}
            alt={img.filename}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            draggable={false}
          />
          {/* Hover overlay: drag handle only */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
            <span style={{ fontSize: '28px', color: 'white', lineHeight: 1 }}>⠿</span>
          </div>
        </div>
      ))}
    </div>
  )
}


// ─── Work Upload Zone ──────────────────────────────────────────────────────────

function WorkUploadZone({ folder, password, onDone }) {
  const [files, setFiles]       = useState([])
  const [progress, setProgress] = useState([])
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)

  const addFiles = (f) => setFiles(prev => [...prev, ...Array.from(f).filter(x => x.type.startsWith('image/'))])

  const handleUpload = async () => {
    if (!files.length) return
    setUploading(true)
    setProgress(files.map(() => 'waiting'))
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setProgress(p => { const n=[...p]; n[i]='uploading'; return n })
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': file.type, 'x-admin-password': password, 'x-folder-name': `mark-portfolio/${folder}`, 'x-file-name': file.name },
          body: file,
        })
        if (!res.ok) throw new Error()
        setProgress(p => { const n=[...p]; n[i]='done'; return n })
      } catch { setProgress(p => { const n=[...p]; n[i]='error'; return n }) }
    }
    setUploading(false); setFiles([]); onDone()
  }

  const icon  = s => s==='done'?'✓':s==='error'?'✗':s==='uploading'?'…':'—'
  const color = s => s==='done'?'text-green-600':s==='error'?'text-red-500':s==='uploading'?'text-blue-500':'text-gray-400'

  return (
    <div className="space-y-4">
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true)}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);addFiles(e.dataTransfer.files)}}
        onClick={()=>document.getElementById(`fi-work-${folder}`).click()}
        className={`border-2 border-dashed p-16 text-center cursor-pointer transition-colors ${dragging?'border-black bg-gray-50':'border-gray-200 hover:border-gray-400'}`}
      >
        <p className="text-[11px] font-light tracking-[0.2em] uppercase text-gray-400">Drag photos here or click to select</p>
        <input id={`fi-work-${folder}`} type="file" multiple accept="image/*" className="hidden" onChange={e=>addFiles(e.target.files)} />
      </div>
      {files.length>0 && (
        <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-100 p-3">
          {files.map((f,i)=>(
            <div key={i} className="flex justify-between text-[11px] font-light">
              <span className="truncate text-gray-700 max-w-xs">{f.name}</span>
              <span className={`ml-4 shrink-0 ${color(progress[i])}`}>{icon(progress[i])}</span>
            </div>
          ))}
        </div>
      )}
      {files.length>0&&!uploading&&(
        <button onClick={handleUpload} className="w-full py-3 text-[11px] font-light tracking-[0.2em] uppercase bg-black text-white hover:opacity-70 transition-opacity">
          Upload {files.length} photo{files.length!==1?'s':''} to "{folder}"
        </button>
      )}
      {uploading&&<p className="text-center text-[11px] font-light tracking-[0.2em] uppercase text-gray-400 py-3">Uploading… please wait</p>}
    </div>
  )
}

// ─── Home Photos Manager ───────────────────────────────────────────────────────

function HomePhotosTab({ password, showMsg }) {
  const [homeImages, setHomeImages] = useState([])
  const [loading, setLoading]       = useState(true)
  const [uploading, setUploading]   = useState(false)
  const [dragging, setDragging]     = useState(false)
  const [deleting, setDeleting]     = useState(null)
  const [subTab, setSubTab]         = useState('manage') // 'manage' | 'reorder'
  const [homeOrder, setHomeOrder]   = useState([])
  const [savingOrder, setSavingOrder] = useState(false)

  const loadHomeImages = async () => {
    setLoading(true)
    try {
      const [galleryRes, orderRes] = await Promise.all([
        fetch('/api/home-gallery').then(r => r.json()),
        fetch('/api/order?type=home').then(r => r.json()).catch(() => ({ order: [] })),
      ])
      let imgs = galleryRes.images || []
      if (orderRes.order?.length > 0) {
        setHomeOrder(orderRes.order)
        const map = Object.fromEntries(imgs.map(img => [img.filename, img]))
        const ordered = orderRes.order.map(fn => map[fn]).filter(Boolean)
        const rest    = imgs.filter(img => !orderRes.order.includes(img.filename))
        imgs = [...ordered, ...rest]
      }
      setHomeImages(imgs)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { loadHomeImages() }, [])

  const handleUpload = async (files) => {
    if (!files.length) return
    setUploading(true)
    for (const file of files) {
      try {
        await fetch('/api/home-gallery', {
          method: 'POST',
          headers: { 'Content-Type': file.type, 'x-admin-password': password, 'x-file-name': file.name },
          body: file,
        })
      } catch {}
    }
    setUploading(false)
    showMsg(`✓ ${files.length} photo${files.length!==1?'s':''} added to Home Page!`)
    loadHomeImages()
  }

  const handleDelete = async (img) => {
    if (!confirm(`Remove "${img.filename}" from the home page?`)) return
    setDeleting(img.publicId)
    try {
      await fetch('/api/home-gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ publicId: img.publicId }),
      })
      showMsg(`✓ "${img.filename}" removed.`)
      loadHomeImages()
    } catch { showMsg('✗ Failed to delete.') }
    setDeleting(null)
  }

  const saveHomeOrder = async (ordered) => {
    setSavingOrder(true)
    const order = ordered.map(img => img.filename)
    try {
      await fetch('/api/order?type=home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ order }),
      })
      showMsg('✓ Home page order saved!')
    } catch { showMsg('✗ Failed to save order.') }
    setSavingOrder(false)
  }

  return (
    <div className="space-y-8">
      {/* Sub-tabs */}
      <div className="flex gap-6 border-b border-gray-100">
        {[['manage','Manage Photos'],['reorder','Reorder']].map(([key,label])=>(
          <button key={key} onClick={()=>setSubTab(key)}
            className={`pb-3 text-[11px] font-light tracking-[0.15em] uppercase transition-colors ${subTab===key?'text-black border-b border-black -mb-px':'text-gray-400 hover:text-black'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Manage: Upload + Delete */}
      {subTab==='manage' && (
        <div className="space-y-8">
          {/* Upload zone */}
          <div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-4">Add Photos</h3>
            <div
              onDragOver={e=>{e.preventDefault();setDragging(true)}}
              onDragLeave={()=>setDragging(false)}
              onDrop={e=>{e.preventDefault();setDragging(false);handleUpload(Array.from(e.dataTransfer.files).filter(f=>f.type.startsWith('image/')))}}
              onClick={()=>document.getElementById('fi-home').click()}
              className={`border-2 border-dashed p-12 text-center cursor-pointer transition-colors ${dragging?'border-black bg-gray-50':'border-gray-200 hover:border-gray-400'}`}
            >
              {uploading
                ? <p className="text-[11px] font-light tracking-[0.2em] uppercase text-blue-500">Uploading…</p>
                : <p className="text-[11px] font-light tracking-[0.2em] uppercase text-gray-400">Drag photos here or click to select</p>
              }
              <input id="fi-home" type="file" multiple accept="image/*" className="hidden"
                onChange={e=>handleUpload(Array.from(e.target.files))} />
            </div>
          </div>

          {/* Current photos grid */}
          <div>
            <h3 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-4">
              Current Photos ({homeImages.length})
            </h3>
            {loading
              ? <p className="text-[11px] font-light text-gray-400">Loading…</p>
              : (
                <div className="grid grid-cols-3 gap-3">
                  {homeImages.map(img => (
                    <div key={img.publicId} className="relative group">
                      <img src={img.url} alt={img.filename} className="w-full aspect-square object-cover" />
                      <button
                        onClick={() => handleDelete(img)}
                        disabled={deleting === img.publicId}
                        className="absolute inset-0 bg-white bg-opacity-0 group-hover:bg-opacity-80 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                      >
                        <span className="text-[10px] font-light tracking-[0.15em] uppercase text-red-600">
                          {deleting === img.publicId ? 'Removing…' : 'Remove'}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </div>
      )}

      {/* Reorder */}
      {subTab==='reorder' && (
        <div className="space-y-4">
          <p className="text-[11px] font-light text-gray-400">
            Drag photos in the grid below to change their order on the home page. Hover any photo to see the drag handle. Saves automatically on drop.
          </p>
          {savingOrder && (
            <p className="text-[11px] font-light text-blue-500 tracking-wide">Saving order…</p>
          )}
          {loading
            ? <p className="text-[11px] font-light text-gray-400">Loading photos…</p>
            : <MasonryReorder images={homeImages} onReorder={saveHomeOrder} />
          }
        </div>
      )}

    </div>
  )
}

// ─── Main Admin ────────────────────────────────────────────────────────────────

export default function Admin() {
  const [password, setPassword]         = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [authError, setAuthError]       = useState(false)
  const [tab, setTab]                   = useState('upload')
  const [categories, setCategories]     = useState([])
  const [selectedFolder, setSelectedFolder] = useState('')
  const [newCatName, setNewCatName]     = useState('')
  const [creating, setCreating]         = useState(false)
  const [catOrder, setCatOrder]         = useState([])
  const [savingCat, setSavingCat]       = useState(false)
  const [msg, setMsg]                   = useState('')

  const showMsg = (text) => { setMsg(text); setTimeout(() => setMsg(''), 5000) }

  const loadCategories = async (pw) => {
    try {
      const res  = await fetch('/api/categories', { headers: { 'x-admin-password': pw } })
      const data = await res.json()
      if (data.folders) {
        setCategories(data.folders)
        if (!selectedFolder && data.folders.length > 0) setSelectedFolder(data.folders[0])
      }
    } catch {}
  }

  const loadCatOrder = async () => {
    try {
      const data = await fetch('/api/order?type=categories').then(r => r.json())
      if (data.order?.length > 0) setCatOrder(data.order)
    } catch {}
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/categories', { headers: { 'x-admin-password': password } })
    if (res.status === 401) { setAuthError(true); return }
    setAuthenticated(true); setAuthError(false)
    await Promise.all([loadCategories(password), loadCatOrder()])
  }

  const saveCatOrder = async (order) => {
    setCatOrder(order); setSavingCat(true)
    try {
      await fetch('/api/order?type=categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ order }),
      })
      showMsg('✓ Category order saved! /work page updated.')
    } catch { showMsg('✗ Failed to save.') }
    setSavingCat(false)
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
      showMsg(`✓ Category "${newCatName.trim()}" created!`)
      setNewCatName('')
      await loadCategories(password)
    } catch { showMsg('✗ Failed to create.') }
    setCreating(false)
  }

  const handleDeleteCategory = async (name) => {
    if (!confirm(`Delete "${name}" and ALL its photos permanently? This cannot be undone.`)) return
    showMsg(`Deleting "${name}"…`)
    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error()
      showMsg(`✓ "${name}" deleted.`)
      await loadCategories(password)
    } catch { showMsg('✗ Failed to delete.') }
  }

  const displayCategories = catOrder.length > 0
    ? [...catOrder, ...categories.filter(c => !catOrder.includes(c))]
    : categories.length > 0 ? categories : SEED_CATEGORIES

  // ─── Login ─────────────────────────────────────────────────────────────────
  if (!authenticated) return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-xs font-light tracking-[0.3em] uppercase text-black">Mark Militar</h1>
          <p className="text-[11px] font-light tracking-[0.15em] uppercase text-gray-400 mt-1">Portfolio Admin</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password"
            className="w-full border border-gray-200 px-4 py-3 text-[13px] font-light outline-none focus:border-black transition-colors" />
          {authError && <p className="text-red-500 text-[11px] font-light tracking-wide">Incorrect password</p>}
          <button type="submit" className="w-full py-3 text-[11px] font-light tracking-[0.2em] uppercase bg-black text-white hover:opacity-70 transition-opacity">Sign In</button>
        </form>
      </div>
    </div>
  )

  // ─── Authenticated ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-10 py-6 border-b border-gray-100">
        <a href="/" className="text-xs font-light tracking-[0.2em] uppercase text-black hover:opacity-40 transition-opacity cursor-pointer">Mark Militar</a>
        <button onClick={()=>setAuthenticated(false)} className="text-[11px] font-light tracking-[0.15em] uppercase text-gray-400 hover:text-black transition-colors">Sign Out</button>
      </header>

      <main className="pt-32 px-6 md:px-10 pb-20 max-w-2xl mx-auto">

        {/* Main Tabs — always visible */}
        <div className="flex flex-wrap gap-6 mb-12 border-b border-gray-100">
          {[['upload','Work: Upload'],['categories','Work: Categories'],['work-reorder','Work: Reorder'],['home','Home Page Photos']].map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)}
              className={`pb-4 text-[11px] font-light tracking-[0.2em] uppercase transition-colors ${tab===key?'text-black border-b-2 border-black -mb-px':'text-gray-400 hover:text-black'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Work Upload ── */}
        {tab==='upload' && (
          <div className="space-y-8">
            <p className="text-[12px] font-light text-gray-400">Pick a category, drag photos in, click Upload. Goes live immediately.</p>
            <div>
              <label className="block text-[10px] font-light tracking-[0.2em] uppercase text-gray-400 mb-2">Category</label>
              <select value={selectedFolder} onChange={e=>setSelectedFolder(e.target.value)}
                className="w-full border border-gray-200 px-4 py-3 text-[13px] font-light outline-none focus:border-black appearance-none bg-white">
                {(categories.length > 0 ? categories : SEED_CATEGORIES).map(cat=>(
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            {selectedFolder && (
              <WorkUploadZone key={selectedFolder} folder={selectedFolder} password={password}
                onDone={()=>showMsg(`✓ Photos uploaded to "${selectedFolder}". Live now.`)} />
            )}
          </div>
        )}

        {/* ── Work Categories ── */}
        {tab==='categories' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-2">Create New Category</h2>
              <p className="text-[12px] font-light text-gray-400 mb-6">Type the shoot name, hit Create, then upload photos to it.</p>
              <div className="flex gap-3">
                <input type="text" value={newCatName} onChange={e=>setNewCatName(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&handleCreateCategory()}
                  placeholder="e.g. Nike Fall 2025"
                  className="flex-1 border border-gray-200 px-4 py-3 text-[13px] font-light outline-none focus:border-black transition-colors" />
                <button onClick={handleCreateCategory} disabled={creating||!newCatName.trim()}
                  className="px-6 py-3 text-[11px] font-light tracking-[0.2em] uppercase bg-black text-white hover:opacity-70 disabled:opacity-30 transition-opacity">
                  {creating?'…':'Create'}
                </button>
              </div>
            </div>
            <div>
              <h2 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-6">Existing ({(categories.length||SEED_CATEGORIES.length)})</h2>
              <div>
                {(categories.length>0?categories:SEED_CATEGORIES).map(cat=>(
                  <div key={cat} className="flex items-center justify-between py-4 border-b border-gray-100">
                    <span className="text-[13px] font-light text-gray-800">{cat}</span>
                    <div className="flex items-center gap-4">
                      <button onClick={()=>{setSelectedFolder(cat);setTab('upload')}}
                        className="text-[11px] font-light tracking-[0.15em] uppercase text-gray-400 hover:text-black transition-colors">
                        Upload →
                      </button>
                      <button onClick={()=>handleDeleteCategory(cat)}
                        className="text-[11px] font-light tracking-[0.15em] uppercase text-red-400 hover:text-red-600 transition-colors">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Work Reorder ── */}
        {tab==='work-reorder' && (
          <div className="space-y-6">
            <p className="text-[12px] font-light text-gray-400">Drag categories to reorder how they appear on the /work page. Saves automatically.</p>
            {savingCat && <p className="text-[11px] font-light text-blue-500">Saving…</p>}
            <SortableList
              items={displayCategories}
              onReorder={saveCatOrder}
              renderItem={(cat, i) => (
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[10px] font-light text-gray-300 w-5 shrink-0">{i+1}</span>
                  <span className="text-[13px] font-light text-gray-800 truncate">{cat}</span>
                </div>
              )}
            />
          </div>
        )}

      </main>

      {/* ── Home Page Photos — full width ── */}
      {tab==='home' && (
        <div className="pt-4 px-4 md:px-6 pb-20">
          <HomePhotosTab password={password} showMsg={showMsg} />
        </div>
      )}

      {msg && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-8 py-4 text-[12px] font-light tracking-wide z-50 whitespace-nowrap">
          {msg}
        </div>
      )}
    </div>
  )
}
