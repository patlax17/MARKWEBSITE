import { Link } from 'react-router-dom'
import TopHeader from '../components/TopHeader'
import { portfolioData } from '../data/portfolio'

export default function Work() {
  return (
    <>
      <TopHeader />
      <main className="pt-24 md:pt-32 px-6 md:px-10 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {portfolioData.map((category) => (
            <Link 
              key={category.id} 
              to={`/work/${category.id}`}
              className="group flex flex-col gap-4 text-center items-center"
            >
              <div className="w-full aspect-square overflow-hidden bg-gray-50">
                <img 
                  src={category.cover} 
                  alt={category.title}
                  className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 opacity-0 loaded-fade-in"
                  onLoad={(e) => e.target.classList.add('opacity-100')}
                />
              </div>
              <h2 className="text-[11px] font-light tracking-[0.2em] uppercase text-black group-hover:opacity-40 transition-opacity mt-2">
                {category.title}
              </h2>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
