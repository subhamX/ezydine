import { PrismaClient } from '.prisma/client';
import axios from 'axios'

const resourseUrl = 'https://dining.columbia.edu/sites/default/files/cu_dining/cu_dining_nodes.json?1633724772';
let prisma = new PrismaClient();

export const addSpots = async () => {
    // fetching data
    let res = await axios.get(resourseUrl)
    let data: any = res.data;
    let spots = Object.entries(data['locations'])
    for (let spot of spots) {
        console.log(spot)
        let spotInfo: any = spot[1];
        await prisma.spot.create({
            data: {
                hallName: spotInfo['title'] as string,
                capacity: Math.floor(Math.random() * 800),
                crowdCount: Math.floor(Math.random() * 100),
                description: spotInfo['description'] as string,
                latitude: spotInfo['latitude'] as number,
                longitude: spotInfo['longitude'] as number,
                timings: '09:00___12:00####14:00___16:00####21:00___23:00',
                adminEmail: 'admin@columbia.edu'
            }
        })
    }
}

