import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import TopHeader from '../components/TopHeader'

export default function Work() {
  // null = loading, [] or array = loaded (never pre-fill with stale local data)
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    const applyOrder = (cats, order) => {
      if (!order || order.length === 0) return cats
      const map = Object.fromEntries(cats.map(c => [c.folder, c]))
      const ordered = order.map(folderName => map[folderName]).filter(Boolean)
      const rest = cats.filter(c => !order.includes(c.folder))
      return [...ordered, ...rest]
    }

    Promise.all([
      fetch('/api/gallery').then(r => r.json()),
      fetch('/api/order?type=categories').then(r => r.json()).catch(() => ({ order: [] })),
    ]).then(([galleryData, orderData]) => {
      const cats = Array.isArray(galleryData) && galleryData.length > 0 ? galleryData : []
      setCategories(applyOrder(cats, orderData.order))
    }).catch(() => {
      setCategories([])
    })
  }, [])

  // Show nothing (blank grid area) while the live data is loading
  // — never show stale local JSON that may contain deleted categories
  const loading = categories === null

  return (
    <>
      <TopHeader />
      <main className="pt-24 md:pt-32 px-6 md:px-10 pb-20">
        {loading ? (
          // Skeleton placeholders — same grid layout, no content
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-4 items-center">
                <div className="w-full aspect-square bg-gray-100 animate-pulse" />
                <div className="h-3 w-32 bg-gray-100 animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/work/${cat.id}`}
                className="group flex flex-col gap-4 text-center items-center"
              >
                <div className="w-full aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={cat.cover}
                    alt={cat.title}
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                    style={{ opacity: 0, transition: 'opacity 0.5s ease, transform 0.7s ease' }}
                    onLoad={(e) => { e.target.style.opacity = 1 }}
                  />
                </div>
                <h2 className="text-[11px] font-light tracking-[0.2em] uppercase text-black group-hover:opacity-40 transition-opacity mt-2">
                  {cat.title}
                </h2>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
