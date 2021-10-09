import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { AnnotationIcon, GlobeAltIcon, LightningBoltIcon, ScaleIcon } from '@heroicons/react/outline'
import Header from '../components/header.js'
import axios from 'axios';
import { useState } from 'react';


export async function getServerSideProps() {
  // Fetch data from external API
  try {
    const res1 = await fetch('https://dining.columbia.edu/sites/default/files/cu_dining/cu_dining_nodes.json');
    const spots = await res1.json();

    const res2 = await fetch('https://dining.columbia.edu/cu_dining/rest/crowdedness');
    const crowd = await res2.json();


    return { props: {spots: spots, crowd:crowd.data} };
  }
  catch (error){
    return { notFound: true };
  }
}

function returnThumbnail(e, key, props){

  const crowd_id = e.crowd_id;
  const title = e.title.replace("&#039;", "\'");
  const crowd_max = e.crowd_max;
  const current_crowd_percent = Math.floor(props.crowd[e.crowd_id].client_count * 100 / crowd_max);
  // console.log("Current crowd percentage" + current_crowd_percent);

  return(
    <div key={key}>
      <Link href={`/hall/${crowd_id}/info/`}>

        <div className="rounded bg-white cursor-pointer border-gray-200 shadow-md overflow-hidden relative hover:shadow-lg" key={key}>
          <img src={`/images/${crowd_id}.png`} alt="curry" className="h-32 sm:h-48 w-full object-cover" />
          <div className="m-4">
            <span className="font-bold">{title}</span>
          </div>
          <div className="absolute top-0 ml-2  mt-2 text-xs uppercase font-bold rounded-full">
            {e.closed ? <span className='bg-red-200 p-1 rounded-lg text-red-600'>CLOSED</span> : <span className='bg-green-200 p-1 rounded-lg text-green-600'>OPEN</span>}
          </div>
          <div className='px-3'>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-purple-600">
                {current_crowd_percent}%  Capacity

              </span>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
              <div style={{ width: `${current_crowd_percent}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500">
              </div>
            </div>
          </div>
        </div>

      </Link>
    </div>
  )
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
  console.log(props.crowd);
  console.log(props.spots);

  return (
    <div>
    <Header />
      <div className='px-24 mt-10 grid lg:grid-cols-3 gap-10'>
        {spots.map((e, key) => returnThumbnail(e, key, props))}
      </div>
    </div>
  )
}
