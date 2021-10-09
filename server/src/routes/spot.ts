import { Router } from "express";
import { PrismaClient } from '@prisma/client'


const app = Router()

const prisma = new PrismaClient()

/**
 * Returns all the dining spots
 */
app.get('/all/', async (req, res) => {
    let data = await prisma.spot.findMany();
    res.send(data);
})

/**
 * Route to add a new spot
 * Later it can only be done by an [institute admin (sudo user)]
 */
app.post('/add/', async (req, res) => {
    let spotInfo = req.body;
    let newSpot = await prisma.spot.create({
        data: {
            hallName: spotInfo['hallName'],
            timings: spotInfo.timings,
            description: spotInfo['description'],
            latitude: spotInfo['latitude'],
            longitude: spotInfo['longitude'],
            isClosed: spotInfo['isClosed'],
            capacity: spotInfo['capacity'],
            crowdCount: spotInfo['crowdCount']
        }
    })
    res.send(newSpot);
})

/**
 * Route to get the crowdinfo for any spot
 * TODO: Limit the number of data points sent
 */
app.get('/crowdinfo/:id', async (req, res) => {
    let { id } = req.params;
    let id_int = Number(id);
    // checking if the spotId is a valid id
    if (!id || isNaN(id_int)) {
        return res.send({
            error: true,
            message: 'Id is invalid'
        })
    }
    // checking if there exists a spot with spotId
    let spotInfo = await prisma.spot.findUnique({
        where: {
            spotId: id_int
        },
    })
    if (!spotInfo) {
        return res.send({
            error: true,
            message: 'Invalid SpotInfo'
        })
    }
    // fetching the results
    let results = await prisma.crowdLog.findMany({
        where: {
            spotId: id_int
        },
        select: {
            spot: false,
            timestamp: true,
            clientCount: true
        }
    })

    return res.send(results);
})


/**
 * Route to log a crowd info instance
 */
app.post('/log_crowd/add/', async (req, res) => {
    let data = req.body;
    // TODO: Validate
    // Secure it
    let results = await prisma.crowdLog.create({
        data: {
            clientCount: data.clientCount,
            timestamp: new Date(),
            // while dev only
            // timestamp: new Date(data.timestamp*1000),
            spotId: data.spotId
        }
    })
    res.send(results)
})

export default app;