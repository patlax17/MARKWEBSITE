import { useState } from 'react'
import { NavLink } from 'react-router-dom'

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-6 py-5">
        <NavLink
          to="/"
          className="text-xs font-light tracking-widest uppercase text-black"
          onClick={() => setOpen(false)}
        >
          Mark Militar
        </NavLink>
        <button
          onClick={() => setOpen(!open)}
          className="text-xs font-light tracking-widest uppercase text-black transition-opacity hover:opacity-40"
          aria-label="Toggle menu"
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </header>

      {/* Full-screen mobile menu */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-white flex flex-col items-start justify-center px-10 gap-8">
          <NavLink
            to="/work"
            className={({ isActive }) =>
              `text-3xl font-light tracking-wide text-black transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : ''}`
            }
            onClick={() => setOpen(false)}
          >
            Work
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-3xl font-light tracking-wide text-black transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : ''}`
            }
            onClick={() => setOpen(false)}
          >
            About
          </NavLink>
          <a
            href="https://www.instagram.com/markshotthis/"
            target="_blank"
            rel="noreferrer"
            className="text-3xl font-light tracking-wide text-black transition-opacity hover:opacity-40"
            onClick={() => setOpen(false)}
          >
            Instagram
          </a>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-3xl font-light tracking-wide text-black transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : ''}`
            }
            onClick={() => setOpen(false)}
          >
            Contact
          </NavLink>

          <div className="mt-8 flex flex-col gap-5">
            <a
              href="https://www.tiktok.com/@whatidowhenidonthoop"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-light tracking-widest uppercase text-black transition-opacity hover:opacity-40"
              onClick={() => setOpen(false)}
            >
              TikTok
            </a>
            <a
              href="https://www.linkedin.com/in/mark-militar-42634b376/"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-light tracking-widest uppercase text-black transition-opacity hover:opacity-40"
              onClick={() => setOpen(false)}
            >
              LinkedIn
            </a>
          </div>
        </div>
      )}
    </>
  )
}
