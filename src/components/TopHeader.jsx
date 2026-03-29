import { NavLink } from 'react-router-dom'
import { useState } from 'react'

export default function TopHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* ── Desktop Header ── */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white items-center justify-between px-8 py-5 border-b border-transparent">
        
        {/* Left — Name */}
        <NavLink
          to="/work"
          className="text-xs font-light tracking-widest uppercase text-black hover:opacity-40 transition-opacity whitespace-nowrap"
        >
          Mark Militar
        </NavLink>

        {/* Center — Nav */}
        <nav className="flex items-center gap-10">
          <NavLink
            to="/work"
            className={({ isActive }) =>
              `text-xs font-light tracking-widest uppercase transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : 'text-black'}`
            }
          >
            Work
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-xs font-light tracking-widest uppercase transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : 'text-black'}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-xs font-light tracking-widest uppercase transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : 'text-black'}`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Right — Socials */}
        <div className="flex items-center gap-8">
          <a
            href="https://www.instagram.com/markshotthis/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-light tracking-widest uppercase text-black hover:opacity-40 transition-opacity"
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@whatidowhenidonthoop"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-light tracking-widest uppercase text-black hover:opacity-40 transition-opacity"
          >
            TikTok
          </a>
          <a
            href="https://www.linkedin.com/in/mark-militar-42634b376/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-light tracking-widest uppercase text-black hover:opacity-40 transition-opacity"
          >
            LinkedIn
          </a>
        </div>
      </header>

      {/* ── Mobile Header ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-6 py-5">
        <NavLink
          to="/work"
          className="text-xs font-light tracking-widest uppercase text-black"
          onClick={() => setMenuOpen(false)}
        >
          Mark Militar
        </NavLink>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-xs font-light tracking-widest uppercase text-black hover:opacity-40 transition-opacity"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      {/* ── Mobile Full-screen Menu ── */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white flex flex-col items-start justify-center px-10 gap-8">
          <NavLink
            to="/work"
            className={({ isActive }) =>
              `text-3xl font-light tracking-wide text-black transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            Work
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-3xl font-light tracking-wide text-black transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-3xl font-light tracking-wide text-black transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : ''}`
            }
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>
          <div className="mt-6 flex flex-col gap-5">
            <a href="https://www.instagram.com/markshotthis/" target="_blank" rel="noreferrer"
              className="text-sm font-light tracking-widest uppercase text-black hover:opacity-40 transition-opacity"
              onClick={() => setMenuOpen(false)}>Instagram</a>
            <a href="https://www.tiktok.com/@whatidowhenidonthoop" target="_blank" rel="noreferrer"
              className="text-sm font-light tracking-widest uppercase text-black hover:opacity-40 transition-opacity"
              onClick={() => setMenuOpen(false)}>TikTok</a>
            <a href="https://www.linkedin.com/in/mark-militar-42634b376/" target="_blank" rel="noreferrer"
              className="text-sm font-light tracking-widest uppercase text-black hover:opacity-40 transition-opacity"
              onClick={() => setMenuOpen(false)}>LinkedIn</a>
          </div>
        </div>
      )}
    </>
  )
}
