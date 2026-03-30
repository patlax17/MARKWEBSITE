import { useState, useCallback, useEffect } from 'react'
import TopHeader from '../components/TopHeader'
import Lightbox from '../components/Lightbox'

// Fallback static list (used if Cloudinary API unavailable)
const FALLBACK_IMAGES = [
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
].map(f => `/portfolio/${f}`)

function MasonryImage({ src, index, onClick }) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className="masonry-item" onClick={() => onClick(index)}>
      <img
        src={src}
        alt={`Mark Militar photography ${index + 1}`}
        className={loaded ? 'loaded' : ''}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  )
}

export default function Home() {
  const [images, setImages]       = useState(FALLBACK_IMAGES)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    // 1. Fetch Cloudinary home images
    // 2. Apply saved order on top
    Promise.all([
      fetch('/api/home-gallery').then(r => r.json()).catch(() => ({ images: [] })),
      fetch('/api/order?type=home').then(r => r.json()).catch(() => ({ order: [] })),
    ]).then(([galleryData, orderData]) => {
      let urls = galleryData.images?.map(img => img.url) || []
      if (urls.length === 0) { setImages(FALLBACK_IMAGES); return }

      // Apply saved order if present
      if (orderData.order?.length > 0) {
        const urlMap = Object.fromEntries(
          galleryData.images.map(img => [img.filename, img.url])
        )
        const ordered = orderData.order.map(fn => urlMap[fn]).filter(Boolean)
        const rest    = urls.filter(u => !ordered.includes(u))
        urls = [...ordered, ...rest]
      }

      setImages(urls)
    })
  }, [])

  const openLightbox  = useCallback((i) => setLightboxIndex(i), [])
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage     = useCallback(() => setLightboxIndex(i => (i > 0 ? i - 1 : i)), [])
  const nextImage     = useCallback(() => setLightboxIndex(i => (i < images.length - 1 ? i + 1 : i)), [images])

  return (
    <>
      <TopHeader />
      <div className="pt-24 md:pt-32 px-1.5 md:px-2 pb-8">
        <div className="masonry-grid">
          {images.map((src, i) => (
            <MasonryImage key={src} src={src} index={i} onClick={openLightbox} />
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  )
}
