import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import TopHeader from '../components/TopHeader'
import localData from '../data/work_gallery.json'

export default function Work() {
  const [categories, setCategories] = useState(localData)

  useEffect(() => {
    const applyOrder = (cats, order) => {
      if (!order || order.length === 0) return cats
      // Order stores original folder names; cats have both .folder and .title
      const map = Object.fromEntries(cats.map(c => [c.folder, c]))
      const ordered = order.map(folderName => map[folderName]).filter(Boolean)
      const rest = cats.filter(c => !order.includes(c.folder))
      return [...ordered, ...rest]
    }

    Promise.all([
      fetch('/api/gallery').then(r => r.json()).catch(() => localData),
      fetch('/api/order?type=categories').then(r => r.json()).catch(() => ({ order: [] })),
    ]).then(([galleryData, orderData]) => {
      const cats = Array.isArray(galleryData) && galleryData.length > 0 ? galleryData : localData
      setCategories(applyOrder(cats, orderData.order))
    })
  }, [])

  return (
    <>
      <TopHeader />
      <main className="pt-24 md:pt-32 px-6 md:px-10 pb-20">
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
      </main>
    </>
  )
}
