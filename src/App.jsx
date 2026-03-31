import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Lazy-load every page so only the current route's JS is fetched
const Home    = lazy(() => import('./pages/Home'))
const Work    = lazy(() => import('./pages/Work'))
const Gallery = lazy(() => import('./pages/Gallery'))
const About   = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Admin   = lazy(() => import('./pages/Admin'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/"              element={<Home />} />
          <Route path="/work"          element={<Work />} />
          <Route path="/work/:categoryId" element={<Gallery />} />
          <Route path="/about"         element={<About />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="/admin"         element={<Admin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
