import { useRouter } from "next/router";
import { Line } from 'react-chartjs-2';

import { useEffect, useState } from 'react'
import Navbar from '../../../components/navbar.js'
import { fetchSingleSpotsEndpoint } from "../../../apis.js";
import AdminDescription from "../../../components/AdminDescription.js";


// const products = [
//   {
//     id: 1,
//     name: 'Apple Pie',
//     href: '#',
//     imageSrc: 'https://i.ytimg.com/vi/RoHWiA6pogg/maxresdefault.jpg',
//     imageAlt: "Apple pie.",
//     price: '$5',
//     // color: 'Black',
//   },
//   // More products...
// ]

const crowdData = {
  labels: ['5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'],
  data: [null, null, null, null, 56, 55, 40],
  datasets: [
    {
      label: 'Capacity',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgb(99,102,241)',
      borderColor: 'rgb(99,102,241)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgb(99,102,241)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgb(99,102,241)',
      pointHoverBorderColor: 'rgb(99,102,241)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [65, 59, 80, 81, 56]
    },
    {
      label: 'Predicted Capacity',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(99,102,241, 0.5)',
      borderColor: 'rgba(99,102,241, 0.5)',
      borderCapStyle: 'butt',
      borderDash: [10, 5],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(99,102,241, 0.5)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(99,102,241, 0.5)',
      pointHoverBorderColor: 'rgba(99,102,241, 0.5)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
    }
  ]
};

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
]


export default function HallInfo() {
  const [data, setData] = useState(null)
  const [isLoading, setisLoading] = useState(true);
  const router = useRouter();
  const hallId = router.query.hall_id


  useEffect(() => {
    async function fetchData() {
      // Fetch data from external API
      try {
        const res = await fetch(fetchSingleSpotsEndpoint(hallId));
        const data1 = await res.json();
        setData(data1);
        setisLoading(false);
      }
      catch (error) {
        console.log(error)
        setisLoading(false);
      }
    }
    fetchData()
  }, [hallId])




  if (isLoading) {
    return (
      <div className="text-center mx-2 bg-purple-200 text-purple-700 font-bold rounded p-2">
        Loading
      </div>
    );
  }

  const spotData = data['spotData']
  const menuItems = data['menuItems']

  return (
    <div>
      <div className="py-12 bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {spotData.hallName.replace("&#039;", "\'")}
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            </p>
          </div>
          <div className="line-graph">
            <Line
              data={crowdData}
              width={"100%"}
              height={"50rem"}
              style={{ maxHeight: 250 }}
            />
          </div>
        </div>

        <AdminDescription data={spotData} />


        <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Menu Items</h2>

          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {menuItems.map((product) => (
              <div key={product.mealId} className="shadow-md border-2 p-2 rounded group relative">
                <div className="w-full min-h-80  bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <img
                    src={product.image}
                    alt={product.image}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-lg font-extrabold  ">
                      <a href={product.href ?? "##"}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.title}
                      </a>
                    </h3>
                    {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                  </div>
                  <p className="text-sm font-medium text-gray-900">$ {Math.round(Math.random() * 10)}</p>
                </div>
                <div className='mt-3'>
                  <p className='font-bold border-b-2 text-gray-700'>Nutrition Facts</p>

                  <div className='flex justify-between'>
                    <p className='font-bold text-gray-600'>Amount per serving</p>
                    <p>8 oz</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='font-bold text-gray-600'>Calories</p>
                    <p>290</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='font-bold text-gray-600'>Total Fat</p>
                    <p>{product.total_fat} mg</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='font-bold text-gray-600'>Saturated Fat</p>
                    <p>{product.saturated_fat} mg</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='font-bold text-gray-600'>Sodium</p>
                    <p>{product.sodium} mg</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='font-bold text-gray-600'>Total Carbohydrate</p>
                    <p>{product.total_carbohydrate} mg</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='font-bold text-gray-600'>Total Dietary Fiber</p>
                    <p>{product.total_dietary_fiber} mg</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='font-bold text-gray-600'>Total Protein</p>
                    <p>{product.total_protein} mg</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='font-bold text-gray-600'>Total Carbon</p>
                    <p>{product.total_carbon} kg</p>
                  </div>
                  <div className='flex justify-between'>
                    <p className='font-bold text-gray-600'>Total Water Used</p>
                    <p>{product.total_water_used} lts</p>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>


        <div className='max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8'>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 pb-5">Location</h2>
          <div className="mapouter mx-auto"><div className="gmap_canvas"><iframe width={1080} height={500} id="gmap_canvas" src="https://maps.google.com/maps?q=JJ%20Place,%20columbia&t=&z=15&ie=UTF8&iwloc=&output=embed" frameBorder={0} scrolling="no" marginHeight={0} marginWidth={0} /><a href="https://www.whatismyip-address.com" /><br /><style dangerouslySetInnerHTML={{ __html: ".mapouter{position:relative;text-align:right;height:500px;width:1080px;}" }} /><a href="https://www.embedgooglemap.net">google maps in html</a><style dangerouslySetInnerHTML={{ __html: ".gmap_canvas {overflow:hidden;background:none!important;height:500px;width:1080px;}" }} /></div></div>
        </div>


      </div>
    </div>

  )
}


// const Nutri = () => {
//   return (
//   )
// }