import axios from 'axios'

const resourseUrl = 'https://dining.columbia.edu/sites/default/files/cu_dining/cu_dining_nodes.json?1633724772';
const serverUrl = 'http://localhost:8000/spot/add/';

export const addSpots = async () => {
    // fetching data
    let res = await axios.get(resourseUrl)
    let data: any = res.data;
    let spots = Object.entries(data['locations'])
    for (let spot of spots) {
        console.log(spot)
        let spotInfo: any = spot[1];
        const results = await axios.post(serverUrl, {
            hallName: spotInfo['title'],
            description: spotInfo['description'],
            latitude: spotInfo['latitude'],
            longitude: spotInfo['longitude'],
            isClosed: false,
            capacity: Math.floor(Math.random() * 800),
            timings: '09:00___12:00####14:00___16:00####21:00___23:00',
            crowdCount: Math.floor(Math.random() * 100)
        })
        console.log(results.data)
    }
}

