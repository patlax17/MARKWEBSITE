import TopHeader from '../components/TopHeader'

export default function Contact() {
  return (
    <>
      <TopHeader />

      <div className="pt-32 md:pt-40 px-8 md:px-16 pb-20 max-w-xl mx-auto">
        <p className="text-xs tracking-widest uppercase font-light text-black opacity-40 mb-10">
          Contact
        </p>

        <h1 className="text-2xl font-light text-black leading-relaxed mb-8 tracking-wide">
          Get in Touch
        </h1>

        <div className="flex flex-col gap-4 text-sm font-light text-black leading-loose opacity-80 mb-12">
          <p>
            Available for editorial, documentary, sports, and portrait commissions.
          </p>
          <p>
            Based in New York. Available to travel.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <a
            href="mailto:contact@markmilitar.com"
            className="nav-link"
          >
            Email — contact@markmilitar.com
          </a>
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
