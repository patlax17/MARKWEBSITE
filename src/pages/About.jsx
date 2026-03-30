import { useState, useEffect } from 'react'
import TopHeader from '../components/TopHeader'

const DEFAULT_TEXT = `Mark Militar is a photographer and visual storyteller based in New York. His work spans sports, portraiture, documentary, and travel — each image rooted in a commitment to authentic, unmanipulated moments.

With a background in both editorial and long-form documentary work, Mark approaches every shoot with patience and intention. He believes light was never just light — it is the architecture of feeling.

His editorial work has taken him across New York City's boroughs, to Portugal, Japan, and beyond — always in pursuit of the quiet, unrepeatable instant.

All work published with intent.`

export default function About() {
  const [aboutText, setAboutText] = useState(null)

  useEffect(() => {
    fetch('/api/about')
      .then(res => res.json())
      .then(data => {
        setAboutText(data.text ? data.text : DEFAULT_TEXT)
      })
      .catch(() => {
        setAboutText(DEFAULT_TEXT)
      })
  }, [])

  return (

    <>
      <TopHeader />

      <div className="pt-32 md:pt-40 px-8 md:px-16 pb-20 max-w-2xl mx-auto">
        <p className="text-xs tracking-widest uppercase font-light text-black opacity-40 mb-10">
          About
        </p>

        <h1 className="text-2xl font-light text-black leading-relaxed mb-8 tracking-wide">
          Mark Militar
        </h1>

        <div className="flex flex-col gap-5 text-sm font-light text-black leading-loose opacity-80 whitespace-pre-line">
          {aboutText === null ? (
            <div className="animate-pulse flex flex-col gap-3">
              <div className="h-3 w-full bg-gray-50 mb-3" />
              <div className="h-3 w-11/12 bg-gray-50" />
              <div className="h-3 w-10/12 bg-gray-50" />
              <div className="h-3 w-full bg-gray-50 mt-4" />
              <div className="h-3 w-9/12 bg-gray-50" />
            </div>
          ) : (
            aboutText
          )}
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
