import { useParams, Link } from 'react-router-dom'
import { useState, useCallback, useEffect } from 'react'
import TopHeader from '../components/TopHeader'
import Lightbox from '../components/Lightbox'
import localData from '../data/work_gallery.json'

function MasonryImage({ src, index, onClick }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="masonry-item mb-4 overflow-hidden cursor-pointer" onClick={() => onClick(index)}>
      <img
        src={src}
        alt="Mark Militar Photography"
        className={`w-full h-auto transition-all duration-700 ease-in-out hover:opacity-80 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  )
}

export default function Gallery() {
  const { categoryId } = useParams()
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [category, setCategory] = useState(null)

  useEffect(() => {
    // Try live API first
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const found = data.find(c => c.id === categoryId)
          if (found) { setCategory(found); return }
        }
        // Fallback to local JSON
        const local = localData.find(c => c.id === categoryId)
        setCategory(local || null)
      })
      .catch(() => {
        const local = localData.find(c => c.id === categoryId)
        setCategory(local || null)
      })
  }, [categoryId])

  const openLightbox = useCallback((i) => setLightboxIndex(i), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() => setLightboxIndex(i => (i > 0 ? i - 1 : i)), [])
  const nextImage = useCallback(() => {
    if (!category) return
    setLightboxIndex(i => (i < category.images.length - 1 ? i + 1 : i))
  }, [category])

  if (!category) {
    return (
      <>
        <TopHeader />
        <div className="pt-40 text-center text-[11px] font-light tracking-[0.2em] uppercase text-gray-400">
          Loading…
        </div>
      </>
    )
  }

  return (
    <>
      <TopHeader />
      <main className="pt-24 md:pt-32 px-6 md:px-10 pb-20">
        <div className="mb-10">
          <Link
            to="/work"
            className="text-[11px] font-light tracking-[0.2em] uppercase text-black hover:opacity-40 transition-opacity"
          >
            ← Back to Work
          </Link>
        </div>

        <header className="mb-16 text-center">
          <h1 className="text-[13px] font-light tracking-[0.2em] uppercase text-black">
            {category.title}
          </h1>
        </header>

        <div className="masonry-grid max-w-[1920px] mx-auto overflow-hidden">
          {category.images.map((img, i) => (
            <MasonryImage
              key={`${categoryId}-${i}`}
              src={img}
              index={i}
              onClick={openLightbox}
            />
          ))}
        </div>
      </main>

      {lightboxIndex !== null && (
        <Lightbox
          images={category.images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  )
}
