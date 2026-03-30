import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import TopHeader from '../components/TopHeader'
import localData from '../data/work_gallery.json'

export default function Work() {
  const [categories, setCategories] = useState(localData)

  useEffect(() => {
    // In production, fetch live data from Vercel Blob via API
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setCategories(data) })
      .catch(() => { /* keep local fallback */ })
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
