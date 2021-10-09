import Head from 'next/head'
import Link from 'next/link'
import { AnnotationIcon, GlobeAltIcon, LightningBoltIcon, ScaleIcon } from '@heroicons/react/outline'
import Header from '../components/header.js'

export default function Home() {

  const data = [
    {
      name: 'John Jay Dining Hall',
      closed: false,
      crowd_count: 100,
      capacity: 200,
      hall_id: 10,
    },
    {
      name: 'JJ\'s Place',
      closed: true,
      crowd_count: 5,
      capacity: 800,
      hall_id: 5,
    },
    {
      name: 'Ferris Booth Commons',
      closed: true,
      crowd_count: 156,
      capacity: 200,
      hall_id: 78,
    },
  ]

  return (
    <div>
    <Header />
      <div className='px-24 mt-10 grid lg:grid-cols-3 gap-10'>
        {data.map((e, key) => (
          <div>
            <Link href={`/hall/${e.hall_id}/info/`}>
              <div className="rounded bg-white cursor-pointer border-gray-200 shadow-md overflow-hidden relative hover:shadow-lg" key={key}>
                <img src={`https://source.unsplash.com/random?sig=${key}`} alt="curry" className="h-32 sm:h-48 w-full object-cover" />
                <div className="m-4">
                  <span className="font-bold">{e.name}</span>
                </div>
                <div className="absolute top-0 ml-2  mt-2 text-xs uppercase font-bold rounded-full">
                  {e.closed ? <span className='bg-red-200 p-1 rounded-lg text-red-600'>CLOSED</span> : <span className='bg-green-200 p-1 rounded-lg text-green-600'>OPEN</span>}
                </div>
                <div className='px-3'>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-purple-600">
                      {e.crowd_count * 100 / e.capacity}%
                    </span>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
                    <div style={{ width: `${e.crowd_count * 100 / e.capacity}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500">
                    </div>
                  </div>
                </div>
              </div>

            </Link>
          </div>
        ))}

      </div>
    </div>
  )
}
