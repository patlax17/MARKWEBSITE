import { Link } from 'react-router-dom'
import TopHeader from '../components/TopHeader'

const CATEGORIES = [
  {
    id: '2025-big-east-mens-basketball-championship',
    label: "2025 BIG EAST MEN'S BASKETBALL CHAMPIONSHIP",
    folder: "2025 Big East Men's Basketball Championship",
    cover: "bigeastchip-1.jpg",
  },
  {
    id: '2025-cunyac-mens-basketball-championship',
    label: "2025 CUNYAC MEN'S BASKETBALL CHAMPIONSHIP",
    folder: "2025 CUNYAC Men's Championship",
    cover: "DSC07501-Enhanced-NR.jpg",
  },
  {
    id: 'curtis-high-school-boys-basketball-media-day-2025',
    label: "CURTIS HIGH SCHOOL BOYS BASKETBALL MEDIA DAY 2025",
    folder: "Curtis High School Boys Basketball Media Day 2025",
    cover: "black-6.jpg",
  },
  {
    id: 'high-school-football',
    label: "HIGH SCHOOL FOOTBALL",
    folder: "High School Football",
    cover: "DSC07282-5.JPG",
  },
  {
    id: 'japan',
    label: "JAPAN",
    folder: "Japan",
    cover: "japan-1-5.jpg",
  },
  {
    id: 'liam-murphy-x-chris-ledlum-basketball-camp',
    label: "LIAM MURPHY X CHRIS LEDLUM BASKETBALL CAMP",
    folder: "Liam Murphy x Chris Ledlum Basketball Camp",
    cover: "ledlum.jpg",
  },
  {
    id: 'nike-nyvsny-focus-2025',
    label: "NIKE NYVSNY FOCUS 2025",
    folder: "Nike NYvsNY Focus 2025",
    cover: "DSC06237.jpg",
  },
  {
    id: 'staten-island-hoops',
    label: "STATEN ISLAND HOOPS",
    folder: "Staten Island Hoops",
    cover: "DSC06990.jpg",
  },
]

export default function Work() {
  return (
    <>
      <TopHeader />
      <main className="pt-24 md:pt-32 px-6 md:px-10 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {CATEGORIES.map((cat) => {
            const coverSrc = `/work_gallery/${encodeURIComponent(cat.folder)}/${encodeURIComponent(cat.cover)}`
            return (
              <Link
                key={cat.id}
                to={`/work/${cat.id}`}
                className="group flex flex-col gap-4 text-center items-center"
              >
                <div className="w-full aspect-square overflow-hidden bg-gray-50">
                  <img
                    src={coverSrc}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
                    style={{ opacity: 0 }}
                    onLoad={(e) => { e.target.style.opacity = 1 }}
                  />
                </div>
                <h2 className="text-[11px] font-light tracking-[0.2em] uppercase text-black group-hover:opacity-40 transition-opacity mt-2">
                  {cat.label}
                </h2>
              </Link>
            )
          })}
        </div>
      </main>
    </>
  )
}
