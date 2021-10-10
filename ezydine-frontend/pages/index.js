import Link from "next/link";
import Header from "../components/header.js";
import Navbar from "../components/navbar.js";
import { useEffect, useState } from "react";
import { fetchAllSpotsEndpoint } from "../apis"
import { Loading } from "../components/Loading.js";

const createThumbnail = (spot) => {
  const crowd_percentage = Math.floor((spot.crowdCount * 100) / spot.capacity);
  return (
    <div key={spot.spotId}>
      <Link href={`/hall/${spot.spotId}/info/`}>
        <div
          className="rounded bg-white cursor-pointer border-gray-200 shadow-md overflow-hidden relative hover:shadow-lg"
          key={spot.spotId}
        >
          <img
            src={spot.imageLink}
            alt="curry"
            className="h-32 sm:h-48 w-full object-cover"
          />
          <div className="m-4">
            <span className="font-bold">
              {spot.hallName.replace("&#039;", "'")}
            </span>
          </div>
          <div className="absolute top-0 ml-2  mt-2 text-xs uppercase font-bold rounded-full">
            {spot.isClosed ? (
              <span className="bg-red-200 p-1 rounded-lg text-red-600">
                CLOSED
              </span>
            ) : (
              <span className="bg-green-200 p-1 rounded-lg text-green-600">
                OPEN
              </span>
            )}
          </div>
          <div className="px-3">
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-purple-600">
                {crowd_percentage}% Capacity
              </span>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
              <div
                style={{ width: `${crowd_percentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
              ></div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default function Home() {
  useEffect((e) => {
    async function fetchData() {
      // Fetch data from external API
      try {
        const res = await fetch(fetchAllSpotsEndpoint);
        const data = await res.json();
        setData(data);
        setisLoading(false);
      } catch (error) {
        setisLoading(false);
      }
    }
    fetchData();
  }, []);

  const [data, setData] = useState("");
  const [isLoading, setisLoading] = useState(true);
  if (isLoading) {
    return (
      <Loading />
    );
  }
  const spots = data;
  return (
    <div className='mb-40'>
      <Navbar />
      <Header />
      {spots && spots.length ?
        <div className="px-24 mt-10 grid lg:grid-cols-3 gap-10">
          {spots.map((spot) => createThumbnail(spot))}
        </div>
        : <div className='font-extrabold text-center mx-auto'>No spots available 😢</div>
      }
    </div>
  );
}
