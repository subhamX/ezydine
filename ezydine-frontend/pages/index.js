import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { AnnotationIcon, GlobeAltIcon, LightningBoltIcon, ScaleIcon } from '@heroicons/react/outline'
import Header from '../components/header.js'
import Navbar from '../components/navbar.js'

import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';
import {useDataContext} from '../components/DataProvider'

export async function getServerSideProps() {
  // Fetch data from external API
  try {
    const res = await fetch('https://ezydine.herokuapp.com/spot/all');
    const data = await res.json()
    return { props: {data: data} };
  }
  catch (error){
    return { notFound: true };
  }
}


const createThumbnail = (spot) => {

  const crowd_percentage = Math.floor(spot.crowdCount  * 100/ spot.capacity);
  return(
    <div key={spot.spotId}>
      <Link href={`/hall/${spot.spotId}/info/`}>

        <div className="rounded bg-white cursor-pointer border-gray-200 shadow-md overflow-hidden relative hover:shadow-lg" key={spot.spotId}>
          <img src={`/images/${spot.spotId}.png`} alt="curry" className="h-32 sm:h-48 w-full object-cover" />
          <div className="m-4">
            <span className="font-bold">{(spot.hallName).replace("&#039;", "\'")}</span>
          </div>
          <div className="absolute top-0 ml-2  mt-2 text-xs uppercase font-bold rounded-full">
            {spot.isClosed ? <span className='bg-red-200 p-1 rounded-lg text-red-600'>CLOSED</span> : <span className='bg-green-200 p-1 rounded-lg text-green-600'>OPEN</span>}
          </div>
          <div className='px-3'>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-purple-600">
                {crowd_percentage}%  Capacity

              </span>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
              <div style={{ width: `${crowd_percentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500">
              </div>
            </div>
          </div>
        </div>

      </Link>
    </div>
  )
}



export default function Home({data}) {
  const spots = data.slice(5, 8);
  return (
    <div>
    <Navbar />
    <Header />
      <div className='px-24 mt-10 grid lg:grid-cols-3 gap-10'>
        {spots.map(spot => createThumbnail(spot))}
      </div>
    </div>
  )
  return (<div />)
}
