import { NavLink } from 'react-router-dom'
import { useState } from 'react'

// Simple SVG Icons for brand consistency & build reliability
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
)

export default function TopHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* ── Desktop Header ── */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white items-center justify-between px-10 py-5">

        {/* Left — Brand text */}
        <NavLink
          to="/"
          className="text-xs font-light tracking-[0.2em] uppercase text-black hover:opacity-40 transition-opacity whitespace-nowrap cursor-pointer"
        >
          Mark Militar | MarkShotThis
        </NavLink>

        {/* Center — Nav with logo embedded between Work and About */}
        <nav className="flex items-center gap-10">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-[11px] font-light tracking-[0.15em] uppercase transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : 'text-black'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/work"
            className={({ isActive }) =>
              `text-[11px] font-light tracking-[0.15em] uppercase transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : 'text-black'}`
            }
          >
            Work
          </NavLink>

          {/* MST Logo — center of nav */}
          <NavLink to="/" className="hover:opacity-40 transition-opacity">
            <img src="/logo-black.png" alt="MST logo" className="h-7 w-auto" />
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-[11px] font-light tracking-[0.15em] uppercase transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : 'text-black'}`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `text-[11px] font-light tracking-[0.15em] uppercase transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : 'text-black'}`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Right — Social Icons */}
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/markshotthis/"
            target="_blank"
            rel="noreferrer"
            className="text-black hover:opacity-40 transition-opacity"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <a
            href="https://www.tiktok.com/@whatidowhenidonthoop"
            target="_blank"
            rel="noreferrer"
            className="text-black hover:opacity-40 transition-opacity"
            aria-label="TikTok"
          >
            <TikTokIcon />
          </a>
          <a
            href="https://www.linkedin.com/in/mark-militar-42634b376/"
            target="_blank"
            rel="noreferrer"
            className="text-black hover:opacity-40 transition-opacity"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
        </div>
      </header>

      {/* ── Mobile Header ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-6 py-5">
        <NavLink to="/" className="block hover:opacity-40 transition-opacity cursor-pointer" onClick={() => setMenuOpen(false)}>
          <img src="/logo-black.png" alt="MarkShotThis logo" className="h-7 w-auto" />
        </NavLink>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-[11px] font-light tracking-widest uppercase text-black hover:opacity-40 transition-opacity"
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </header>

      {/* ── Mobile Full-screen Menu ── */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-10">
          <NavLink
            to="/"
            end
            className="text-2xl font-light tracking-wide text-black hover:opacity-40 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/work"
            className="text-2xl font-light tracking-wide text-black hover:opacity-40 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            Work
          </NavLink>
          <NavLink
            to="/about"
            className="text-2xl font-light tracking-wide text-black hover:opacity-40 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>
          <NavLink
            to="/contact"
            className="text-2xl font-light tracking-wide text-black hover:opacity-40 transition-opacity"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </NavLink>

          <div className="flex items-center gap-8 mt-4">
            <a href="https://www.instagram.com/markshotthis/" target="_blank" rel="noreferrer" className="text-black hover:opacity-40">
              <InstagramIcon />
            </a>
            <a href="https://www.tiktok.com/@whatidowhenidonthoop" target="_blank" rel="noreferrer" className="text-black hover:opacity-40">
              <TikTokIcon />
            </a>
            <a href="https://www.linkedin.com/in/mark-militar-42634b376/" target="_blank" rel="noreferrer" className="text-black hover:opacity-40">
              <LinkedInIcon />
            </a>
          </div>
        </div>
      )}
    </>
  )
}
