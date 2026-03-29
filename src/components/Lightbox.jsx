import { useEffect, useCallback } from 'react'

export default function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    },
    [onClose, onNext, onPrev]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [handleKey])

  if (currentIndex === null || currentIndex === undefined) return null

  const src = images[currentIndex]

  return (
    <div
      className="lightbox-overlay"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        Close
      </button>

      {/* Prev */}
      {currentIndex > 0 && (
        <button
          className="lightbox-nav prev"
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          aria-label="Previous"
        >
          ←
        </button>
      )}

      {/* Image */}
      <img
        key={src}
        src={src}
        alt={`Portfolio image ${currentIndex + 1}`}
        className="lightbox-img"
        onClick={(e) => e.stopPropagation()}
      />

      {/* Next */}
      {currentIndex < images.length - 1 && (
        <button
          className="lightbox-nav next"
          onClick={(e) => { e.stopPropagation(); onNext() }}
          aria-label="Next"
        >
          →
        </button>
      )}

      {/* Counter */}
      <p
        className="fixed bottom-6 left-1/2 -translate-x-1/2 text-xs font-light tracking-widest uppercase text-black opacity-40"
        style={{ zIndex: 1001 }}
        onClick={(e) => e.stopPropagation()}
      >
        {currentIndex + 1} / {images.length}
      </p>
    </div>
  )
}
