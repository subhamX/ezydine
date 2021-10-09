import { useAuth0 } from '@auth0/auth0-react'
import type { NextPage } from 'next'
import HeadMeta from '../components/HeadMeta'
import Link from 'next/link'


const Home: NextPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  console.log(user, isAuthenticated, isLoading);

  const data = [
    {
      name: 'JJ Place',
      closed: false,
      crowd_count: 100,
      capacity: 200,
      hall_id: 10,
    },
    {
      name: 'AA Place',
      closed: true,
      crowd_count: 5,
      capacity: 800,
      hall_id: 5,
    },
    {
      name: 'CC Place',
      closed: true,
      crowd_count: 156,
      capacity: 200,
      hall_id: 78,
    },
    {
      name: 'Franks',
      closed: true,
      crowd_count: 156,
      capacity: 200,
      hall_id: 452,
    },

  ]
  return (
    <div className='bg-pink-50 min-h-screen'>
      <HeadMeta title='ezydine | Landing' />

      <div className='h-12 text-lg flex justify-between items-center px-12 mb-10'>
        <div className='font-bold'>
          ezydine
        </div>
        <div className='font-semibold flex justify-evenly gap-5'>
          <div>
            Login
          </div>
          <div>
            Signup
          </div>
          {/* <div>
            Logout
          </div> */}
          {isAuthenticated ? <div>Logout</div> : null}
        </div>
      </div>

      <div>
        <div className='text-2xl font-extrabold text-center'>
          What's Open Now?
        </div>
        <div className='text-lg  text-center'>
          Discover the best dining hall at Columbia
        </div>
      </div>

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
    </div >
  )
}

export default Home
