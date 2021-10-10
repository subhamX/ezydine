import { Router } from "express";
import { PrismaClient } from '@prisma/client'
import { generateErrorPayload } from "../utils/generate_err_payload";


const app = Router()

const prisma = new PrismaClient()



/**
 * Returns all the dining spots
 */
app.get('/all/', async (req, res) => {
    try {
        let data = await prisma.spot.findMany();
        res.send(data);
    } catch (err) {
        res.send(generateErrorPayload(err))
    }
})

/**
 * Route to add a new spot
 * Later it can only be done by an [institute admin (sudo user)]
 */
app.post('/add/', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
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
                    crowdCount: spotInfo['crowdCount'],
                    adminEmail: req.user.email
                }
            })
            res.send(newSpot);
        } else {
            throw Error("Not Authenticated")
        }
    } catch (err) {
        res.send(generateErrorPayload(err))
    }
})

/**
 * Route to get the crowdinfo for any spot
 * TODO: Limit the number of data points sent
 */
app.get('/crowdinfo/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let id_int = Number(id);
        // checking if the spotId is a valid id
        if (!id || isNaN(id_int)) {
            throw Error('Id is invalid')
        }
        // checking if there exists a spot with spotId
        let spotInfo = await prisma.spot.findUnique({
            where: {
                spotId: id_int
            },
        })
        if (!spotInfo) {
            throw Error('Invalid SpotInfo')
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

        res.send(results);
    } catch (err) {
        res.send(generateErrorPayload(err))
    }
})


/**
 * Route to log a crowd info instance
 */
app.post('/log_crowd/add/', async (req, res) => {
    try {
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
    } catch (err) {
        res.send(generateErrorPayload(err))

    }
})

export default app;