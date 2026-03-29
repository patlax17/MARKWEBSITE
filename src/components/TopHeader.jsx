import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { Instagram, Linkedin } from 'lucide-react'

// Simple TikTok SVG Icon for brand consistency
const TikTokIcon = () => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
)

export default function TopHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* ── Desktop Header ── */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white items-center justify-between px-10 py-6">
        
        {/* Left — Name */}
        <NavLink
          to="/work"
          className="text-xs font-light tracking-[0.2em] uppercase text-black hover:opacity-40 transition-opacity whitespace-nowrap"
        >
          Mark Militar
        </NavLink>

        {/* Center — Nav */}
        <nav className="flex items-center gap-12">
          <NavLink
            to="/work"
            className={({ isActive }) =>
              `text-[11px] font-light tracking-[0.15em] uppercase transition-opacity hover:opacity-40 ${isActive ? 'opacity-40' : 'text-black'}`
            }
          >
            Work
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
            <Instagram size={16} strokeWidth={1.5} />
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
            <Linkedin size={16} strokeWidth={1.5} />
          </a>
        </div>
      </header>

      {/* ── Mobile Header ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-6 py-5">
        <NavLink
          to="/work"
          className="text-[11px] font-light tracking-widest uppercase text-black"
          onClick={() => setMenuOpen(false)}
        >
          Mark Militar
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
              <Instagram size={20} strokeWidth={1.5} />
            </a>
            <a href="https://www.tiktok.com/@whatidowhenidonthoop" target="_blank" rel="noreferrer" className="text-black hover:opacity-40">
              <TikTokIcon />
            </a>
            <a href="https://www.linkedin.com/in/mark-militar-42634b376/" target="_blank" rel="noreferrer" className="text-black hover:opacity-40">
              <Linkedin size={20} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      )}
    </>
  )
}
