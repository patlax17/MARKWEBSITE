import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-44 flex-col justify-between py-10 px-8 z-50 bg-white">
      <div>
        <NavLink to="/" className="block mb-10 group">
          <img
            src="/logo-black.png"
            alt="MarkShotThis logo"
            className="w-20 h-auto group-hover:opacity-40 transition-opacity"
          />
        </NavLink>
        <nav className="flex flex-col gap-5">
          <NavLink
            to="/work"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'opacity-40' : ''}`
            }
          >
            Work
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'opacity-40' : ''}`
            }
          >
            About
          </NavLink>
          <a
            href="https://www.instagram.com/markshotthis/"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            Instagram
          </a>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'opacity-40' : ''}`
            }
          >
            Contact
          </NavLink>
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href="https://www.tiktok.com/@whatidowhenidonthoop"
          target="_blank"
          rel="noreferrer"
          className="nav-link"
        >
          TikTok
        </a>
        <a
          href="https://www.linkedin.com/in/mark-militar-42634b376/"
          target="_blank"
          rel="noreferrer"
          className="nav-link"
        >
          LinkedIn
        </a>
      </div>
    </aside>
  )
}
