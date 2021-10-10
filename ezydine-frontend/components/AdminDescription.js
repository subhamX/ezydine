
// const data = {
//   adminEmail: "admin@columbia.edu",
//   capacity: 279,
//   crowdCount: 38,
//   description: "hello world",
//   hallName: "Ferris Booth Commons",
//   isClosed: false,
//   latitude: "40.8069",
//   longitude: "-73.9637",
//   spotId: 6,
//   timings: "09:00___12:00####14:00___16:00####21:00___23:00"
// }



export default function AdminDescription({ data }) {
  console.log(data)
  return (
    <div className='px-36'>
      {/* <div className='flex justify-between text-gray-700 text-lg font-medium'>
        <div dangerouslySetInnerHTML={{ __html: data.description }}>
        </div>
      </div> */}


    </div>
  )
}
