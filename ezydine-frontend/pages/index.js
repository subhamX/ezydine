import Head from 'next/head'
import Link from 'next/link'
import { AnnotationIcon, GlobeAltIcon, LightningBoltIcon, ScaleIcon } from '@heroicons/react/outline'
import Header from '../components/header.js'
import axios from 'axios';
import { useState } from 'react';


export async function getServerSideProps() {
  // Fetch data from external API
  try {
    const res = await fetch('https://dining.columbia.edu/sites/default/files/cu_dining/cu_dining_nodes.json?1633558414');
    const data = await res.json();
    return { props: {spots: data} };
  }
  catch (error){
    return { notFound: true };
  }
}


// Home.getInitialProps = async ctx => {
  // try {
  //   const res = await axios.get('https://dining.columbia.edu/sites/default/files/cu_dining/cu_dining_nodes.json?1633558414');
  //   const spots = spots.data;
  //   console.log(spots);
  //   return { spots };
  // } catch (error) {
  //   return { error };
  // }
// };



export default function Home(props) {


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

  const spots = props.spots.locations.filter(location => location.display_crowd == "1");


  return (
    <div>
    <Header />
      <div className='px-24 mt-10 grid lg:grid-cols-3 gap-10'>
        {spots.map((e, key) => (
          <div key={key}>
            <Link href={`/hall/${e.crowd_id}/info/`}>

              <div className="rounded bg-white cursor-pointer border-gray-200 shadow-md overflow-hidden relative hover:shadow-lg" key={key}>
                <img src={`https://source.unsplash.com/random?sig=${key}`} alt="curry" className="h-32 sm:h-48 w-full object-cover" />
                <div className="m-4">
                  <span className="font-bold">{e.title.toString()}</span>
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
