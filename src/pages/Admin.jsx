import { useState, useCallback, useEffect, useRef } from 'react'

// ─── Constants ────────────────────────────────────────────────────────────────

const HOME_IMAGES = [
  'DSC07282-5.JPG','DSC07472-9.JPG','DSC07530-13.JPG','DSC07585-16.JPG',
  'DSC07730 2.jpg','DSC07957-6.jpg','DSC08027 2.jpg','DSC08242-11.jpg',
  'DSC08274-12.jpg','DSC08447.jpg','DSC08474.jpg','DSC08589-16.jpg',
  'DSC08704-17.jpg','IMG_6077.jpg','IMG_6087.jpg','IMG_6091.jpg',
  'IMG_7263.jpg','NEWDORP-2.JPG','NEWDORP-5.JPG','NEWDORP-6.JPG',
  'babyshaq.jpg','bleed-10.jpg','bleed-7.jpg','bleed-9.jpg',
  'chaching.jpg','compressions-1-2.jpg','farrell-17.jpg','farrell-9.jpg',
  'farrell.jpg','farrellchip-1.jpg','farrellchip-4.jpg','farrellchip-6.jpg',
  'farrellpregame-1.jpg','gia-1.jpg','haad.jpg','japan-1-5.jpg',
  'japan-2.jpg','ledlum.jpg','ledlummurphy10.jpg','ledlummurphy14.jpg',
  'ledlummurphy22.jpg','ledlummurphy23.jpg','ledlummurphy8.jpg',
  'locerkroom-2 2.JPG','militar-mark-midterm1.jpg','militar-mark-midterm12.jpg',
  'militar-mark-midterm13.jpg','militar-mark-midterm2.jpg',
  'porto-1-12.jpg','porto-1-2.jpg','porto-1-3.jpg','porto-1-4.jpg',
  'porto-1-5.jpg','porto-1-6.jpg','porto-1-7.jpg','porto-1.jpg',
  'porto-2-3.jpg','porto-2.jpg','porto-3-2.jpg','porto-3-3.jpg',
  'porto-3.jpg','porto-4-2.jpg','porto-4-3.jpg','porto-4.jpg',
  'porto-5-2.jpg','porto-5.jpg','porto-6-2.jpg','porto-6.jpg',
  'porto-7.jpg','porto-8.jpg','porto-9.jpg','post12.jpg',
  'post3.jpg','reid.jpg','stop4watson-1.jpg','stretch.jpg',
  'tville-13.jpg','tville-14.jpg','tville-2.jpg','tville-7.jpg',
  'tvilleatcurtis-19.jpg','tvilleatcurtis-4.jpg','tvilleatcurtis-5.jpg',
  'tvilleatcurtis-6.jpg',
]

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

// ─── Drag-to-reorder list ──────────────────────────────────────────────────────

function SortableList({ items, renderItem, onReorder }) {
  const dragIndex = useRef(null)
  const [list, setList] = useState(items)

  useEffect(() => setList(items), [items])

  const handleDragStart = (i) => { dragIndex.current = i }

  const handleDragOver = (e, i) => {
    e.preventDefault()
    if (dragIndex.current === null || dragIndex.current === i) return
    const next = [...list]
    const [moved] = next.splice(dragIndex.current, 1)
    next.splice(i, 0, moved)
    dragIndex.current = i
    setList(next)
  }

  const handleDrop = () => {
    onReorder(list)
    dragIndex.current = null
  }

  return (
    <ul className="space-y-2">
      {list.map((item, i) => (
        <li
          key={typeof item === 'string' ? item : item.id || i}
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

// ─── Upload zone ───────────────────────────────────────────────────────────────

function UploadZone({ folder, password, onDone }) {
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
      } catch {
        setProgress(p => { const n=[...p]; n[i]='error'; return n })
      }
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
        onClick={()=>document.getElementById(`fi-${folder}`).click()}
        className={`border-2 border-dashed p-16 text-center cursor-pointer transition-colors ${dragging?'border-black bg-gray-50':'border-gray-200 hover:border-gray-400'}`}
      >
        <p className="text-[11px] font-light tracking-[0.2em] uppercase text-gray-400">Drag photos here or click to select</p>
        <input id={`fi-${folder}`} type="file" multiple accept="image/*" className="hidden" onChange={e=>addFiles(e.target.files)} />
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

// ─── Main Admin ────────────────────────────────────────────────────────────────

export default function Admin() {
  const [password, setPassword]       = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [authError, setAuthError]     = useState(false)
  const [tab, setTab]                 = useState('upload')
  const [categories, setCategories]   = useState([])
  const [selectedFolder, setSelectedFolder] = useState('')
  const [newCatName, setNewCatName]   = useState('')
  const [creating, setCreating]       = useState(false)

  // Reorder state
  const [catOrder, setCatOrder]       = useState([])
  const [homeOrder, setHomeOrder]     = useState([])
  const [savingCat, setSavingCat]     = useState(false)
  const [savingHome, setSavingHome]   = useState(false)
  const [reorderSub, setReorderSub]   = useState('categories') // 'categories' | 'home'
  const [msg, setMsg]                 = useState('')

  const showMsg = (text) => { setMsg(text); setTimeout(()=>setMsg(''), 5000) }

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

  const loadOrders = async () => {
    try {
      const [cr, hr] = await Promise.all([
        fetch('/api/order?type=categories').then(r=>r.json()),
        fetch('/api/order?type=home').then(r=>r.json()),
      ])
      if (cr.order?.length > 0) setCatOrder(cr.order)
      if (hr.order?.length > 0) setHomeOrder(hr.order)
    } catch {}
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/categories', { headers: { 'x-admin-password': password } })
    if (res.status === 401) { setAuthError(true); return }
    setAuthenticated(true); setAuthError(false)
    await Promise.all([loadCategories(password), loadOrders()])
  }

  // Save category order
  const saveCatOrder = async (order) => {
    setCatOrder(order); setSavingCat(true)
    try {
      await fetch('/api/order?type=categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ order }),
      })
      showMsg('✓ Category order saved! The /work page now reflects this order.')
    } catch { showMsg('✗ Failed to save order.') }
    setSavingCat(false)
  }

  // Save home image order
  const saveHomeOrder = async (order) => {
    setHomeOrder(order); setSavingHome(true)
    try {
      await fetch('/api/order?type=home', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ order }),
      })
      showMsg('✓ Homepage order saved! The home page now reflects this order.')
    } catch { showMsg('✗ Failed to save order.') }
    setSavingHome(false)
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
      showMsg(`✓ Category "${newCatName.trim()}" created! Upload photos to it from the Upload tab.`)
      setNewCatName('')
      await loadCategories(password)
    } catch { showMsg('✗ Failed to create. Try again.') }
    setCreating(false)
  }

  // Derive display lists for reorder
  const displayCategories = catOrder.length > 0
    ? [...catOrder, ...categories.filter(c => !catOrder.includes(c))]
    : categories.length > 0 ? categories : SEED_CATEGORIES

  const displayHomeImages = homeOrder.length > 0
    ? [...homeOrder, ...HOME_IMAGES.filter(f => !homeOrder.includes(f))]
    : HOME_IMAGES

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
        <span className="text-xs font-light tracking-[0.2em] uppercase text-black">Mark Militar — Admin</span>
        <button onClick={()=>setAuthenticated(false)} className="text-[11px] font-light tracking-[0.15em] uppercase text-gray-400 hover:text-black transition-colors">Sign Out</button>
      </header>

      <main className="pt-32 px-6 md:px-10 pb-20 max-w-2xl mx-auto">

        {/* Main Tabs */}
        <div className="flex gap-8 mb-12 border-b border-gray-100">
          {[['upload','Upload Photos'],['categories','Manage Categories'],['reorder','Reorder']].map(([key,label])=>(
            <button key={key} onClick={()=>setTab(key)}
              className={`pb-4 text-[11px] font-light tracking-[0.2em] uppercase transition-colors ${tab===key?'text-black border-b-2 border-black -mb-px':'text-gray-400 hover:text-black'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Upload Tab ── */}
        {tab==='upload' && (
          <div className="space-y-8">
            <p className="text-[12px] font-light text-gray-400">Pick a category, drag in your photos, then click Upload. Images go live immediately.</p>
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
              <UploadZone key={selectedFolder} folder={selectedFolder} password={password}
                onDone={()=>showMsg(`✓ Photos uploaded to "${selectedFolder}". Live on site now.`)} />
            )}
          </div>
        )}

        {/* ── Categories Tab ── */}
        {tab==='categories' && (
          <div className="space-y-12">
            <div>
              <h2 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-2">Create New Category</h2>
              <p className="text-[12px] font-light text-gray-400 mb-6">Type the name of the new shoot or project. After creating, upload photos to it.</p>
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
              <h2 className="text-[11px] font-light tracking-[0.2em] uppercase text-black mb-6">Existing Categories ({categories.length || SEED_CATEGORIES.length})</h2>
              <div className="space-y-0">
                {(categories.length>0?categories:SEED_CATEGORIES).map(cat=>(
                  <div key={cat} className="flex items-center justify-between py-4 border-b border-gray-100">
                    <span className="text-[13px] font-light text-gray-800">{cat}</span>
                    <button onClick={()=>{setSelectedFolder(cat);setTab('upload')}}
                      className="text-[11px] font-light tracking-[0.15em] uppercase text-gray-400 hover:text-black transition-colors">
                      Upload Photos →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Reorder Tab ── */}
        {tab==='reorder' && (
          <div className="space-y-8">
            <p className="text-[12px] font-light text-gray-400">Drag items to reorder. Changes save automatically after each drag.</p>

            {/* Sub-tabs */}
            <div className="flex gap-6 border-b border-gray-100">
              {[['categories','Work Categories'],['home','Home Page Photos']].map(([key,label])=>(
                <button key={key} onClick={()=>setReorderSub(key)}
                  className={`pb-3 text-[11px] font-light tracking-[0.15em] uppercase transition-colors ${reorderSub===key?'text-black border-b border-black -mb-px':'text-gray-400 hover:text-black'}`}>
                  {label}
                </button>
              ))}
            </div>

            {/* Reorder: Categories */}
            {reorderSub==='categories' && (
              <div className="space-y-4">
                <p className="text-[11px] font-light text-gray-400">Drag to change the order categories appear on the /work page.</p>
                {savingCat && <p className="text-[11px] font-light text-blue-500 tracking-wide">Saving…</p>}
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

            {/* Reorder: Home images */}
            {reorderSub==='home' && (
              <div className="space-y-4">
                <p className="text-[11px] font-light text-gray-400">Drag to change the order photos appear on the home page masonry grid.</p>
                {savingHome && <p className="text-[11px] font-light text-blue-500 tracking-wide">Saving…</p>}
                <SortableList
                  items={displayHomeImages}
                  onReorder={saveHomeOrder}
                  renderItem={(filename, i) => (
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[10px] font-light text-gray-300 w-5 shrink-0">{i+1}</span>
                      <img src={`/portfolio/${filename}`} alt="" className="w-10 h-10 object-cover shrink-0 bg-gray-50" />
                      <span className="text-[12px] font-light text-gray-600 truncate">{filename}</span>
                    </div>
                  )}
                />
              </div>
            )}
          </div>
        )}

      </main>

      {msg && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-black text-white px-8 py-4 text-[12px] font-light tracking-wide z-50 whitespace-nowrap">
          {msg}
        </div>
      )}
    </div>
  )
}
