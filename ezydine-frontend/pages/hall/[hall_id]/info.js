import { useRouter } from "next/router";
import {Line} from 'react-chartjs-2';

import { Fragment } from 'react'
import { Popover, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { useLocation } from 'react-router-dom'
import Parser from 'html-react-parser';
import Navbar from '../../../components/navbar.js'


const products = [
  {
    id: 1,
    name: 'Basic Tee',
    href: '#',
    imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
    imageAlt: "Front of men's Basic Tee in black.",
    price: '$35',
    color: 'Black',
  },
  // More products...
]

const crowdData = {
  labels: ['5PM', '6PM', '7PM', '8PM', '9PM', '10PM', '11PM'],
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
      data: [null, null, null, null, 56, 55, 40]
    }
  ]
};

const navigation = [
  { name: 'Product', href: '#' },
  { name: 'Features', href: '#' },
  { name: 'Marketplace', href: '#' },
  { name: 'Company', href: '#' },
]


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

const HallInfo = ({ data }) => {
    const router = useRouter();
    const hallId = router.query.hall_id
    const spotData = data[hallId];
    console.log(data);
    console.log(spotData);
    return (
      <div>
        <Navbar />
        <div className="py-12 bg-white">
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
                 style={{maxHeight:250}}
               />
             </div>
         </div>
         <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Menu Items</h2>

          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
                  <img
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    className="w-full h-full object-center object-cover lg:w-full lg:h-full"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a href={product.href}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.color}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

       </div>
     </div>

    )
}

export default HallInfo;
