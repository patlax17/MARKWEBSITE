import { useParams, Link } from 'react-router-dom'
import { useState, useCallback } from 'react'
import TopHeader from '../components/TopHeader'
import Lightbox from '../components/Lightbox'
import { portfolioData } from '../data/portfolio'

function MasonryImage({ src, index, onClick }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="masonry-item mb-4 overflow-hidden" onClick={() => onClick(index)}>
      <img
        src={`/portfolio/${src}`}
        alt={`Mark Militar Photography`}
        className={`w-full h-auto transition-all duration-700 ease-in-out cursor-pointer hover:opacity-80 aspect-auto ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  )
}

export default function Gallery() {
  const { categoryId } = useParams()
  const [lightboxIndex, setLightboxIndex] = useState(null)
  
  const category = portfolioData.find(c => c.id === categoryId)

  const openLightbox = useCallback((i) => setLightboxIndex(i), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() => setLightboxIndex(i => (i > 0 ? i - 1 : i)), [])
  const nextImage = useCallback(() => setLightboxIndex(i => (i < category.images.length - 1 ? i + 1 : i)), [])

  if (!category) return null

  const lightboxImages = category.images.map(img => `/portfolio/${img}`)

  return (
    <>
      <TopHeader />
      
      <main className="pt-32 px-6 md:px-10 pb-20">
        <header className="max-w-4xl mx-auto mb-20 text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-black mb-8 leading-tight">
            {category.title}
          </h1>
          <p className="text-[13px] md:text-sm font-light leading-relaxed text-black max-w-xl mx-auto opacity-70">
            {category.description}
          </p>
        </header>

        <div className="masonry-grid max-w-[1920px] mx-auto overflow-hidden">
          {category.images.map((img, i) => (
            <MasonryImage 
              key={`${categoryId}-${img}`} 
              src={img} 
              index={i} 
              onClick={openLightbox} 
            />
          ))}
        </div>

        <div className="mt-20 flex justify-center">
          <Link 
            to="/work" 
            className="text-[11px] font-light tracking-[0.2em] uppercase text-black hover:opacity-40 transition-opacity"
          >
            ← Back to Work
          </Link>
        </div>
      </main>

      {lightboxIndex !== null && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  )
}
