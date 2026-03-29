import Sidebar from '../components/Sidebar'
import MobileNav from '../components/MobileNav'

export default function About() {
  return (
    <>
      <Sidebar />
      <MobileNav />

      <div className="md:ml-44 pt-24 md:pt-16 px-8 md:px-16 pb-20 max-w-2xl">
        <p className="text-xs tracking-widest uppercase font-light text-black opacity-40 mb-10">
          About
        </p>

        <h1 className="text-2xl font-light text-black leading-relaxed mb-8 tracking-wide">
          Mark Militar
        </h1>

        <div className="flex flex-col gap-5 text-sm font-light text-black leading-loose opacity-80">
          <p>
            Mark Militar is a photographer and visual storyteller based in New York.
            His work spans sports, portraiture, documentary, and travel — each
            image rooted in a commitment to authentic, unmanipulated moments.
          </p>
          <p>
            With a background in both editorial and long-form documentary work,
            Mark approaches every shoot with patience and intention. He believes
            light was never just light — it is the architecture of feeling.
          </p>
          <p>
            His editorial work has taken him across New York City's boroughs,
            to Portugal, Japan, and beyond — always in pursuit of the quiet,
            unrepeatable instant.
          </p>
          <p>
            All work published with intent.
          </p>
        </div>

        <div className="mt-14 flex flex-col gap-3">
          <a
            href="https://www.instagram.com/markshotthis/"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            Instagram — @markshotthis
          </a>
          <a
            href="https://www.tiktok.com/@whatidowhenidonthoop"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            TikTok — @whatidowhenidonthoop
          </a>
          <a
            href="https://www.linkedin.com/in/mark-militar-42634b376/"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
          >
            LinkedIn — Mark Militar
          </a>
        </div>
      </div>
    </>
  )
}
