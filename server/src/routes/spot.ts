import { Router } from "express";
import { PrismaClient } from '@prisma/client'
import { generateErrorPayload } from "../utils/generate_err_payload";
import dayjs from "dayjs";
import { checkSpotStatus } from "../utils/check_spot_status";


const app = Router()

const prisma = new PrismaClient()


/**
 * Returns all the dining spots
 */
app.get('/all/', async (req, res) => {
    try {
        let data = await prisma.spot.findMany();

        // adding isClosed field
        let finalData = data.map(e => {
            return {
                ...e,
                isClosed: (checkSpotStatus(e) !== 'OPEN')
            }
        })
        res.send(finalData);
    } catch (err) {
        res.send(generateErrorPayload(err))
    }
})

/**
 * Returns the dining spot info of a single spot
 * and the menu items
 */
app.get('/info/:id', async (req, res) => {
    try {
        let { id } = req.params;
        let data = await prisma.spot.findUnique({
            where: {
                spotId: parseInt(id)
            }
        });
        if (!data) {
            throw Error("Invalid spotId")
        }
        let menuItems = await prisma.meal.findMany({
            where: {
                spotId: parseInt(id)
            }
        })

        let crowdData = await prisma.crowdLog.findMany({
            where: {
                spotId: parseInt(id)
            }
        })

        let labels: string[] = [], dataValues: Number[] = [];
        for (let d of crowdData) {
            let tmp = dayjs(d['timestamp']).format('HH:mm')
            labels.push(tmp)
            dataValues.push(d['clientCount'])
        }

        let spotData = {
            ...data,
            isClosed: (checkSpotStatus(data) !== 'OPEN')
        }

        res.send({
            spotData,
            menuItems,
            crowdData: {
                labels: labels,
                data: dataValues
            }
        });
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
            let adminEmail = req.user.email;
            // authenticated users are either admin or manager
            // and they are authorised to create a new spot

            let spotInfo = req.body;
            let newSpot = await prisma.spot.create({
                data: {
                    hallName: spotInfo['hallName'],
                    timings: spotInfo.timings,
                    description: spotInfo['description'],
                    latitude: spotInfo['latitude'],
                    longitude: spotInfo['longitude'],
                    capacity: spotInfo['capacity'],
                    crowdCount: spotInfo['crowdCount'],
                    adminEmail
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
        if(req.isUnauthenticated()){
            throw Error("You need to be authenticated to add logs")
        }
        let data = req.body;
        // TODO: Validate
        // checking and updating if there exists a spot with spotId
        await prisma.spot.update({
            where: {
                spotId: data.spotId
            },
            data: {
                crowdCount: data.clientCount
            }
        })
        // Secure it
        let results = await prisma.crowdLog.create({
            data: {
                clientCount: data.clientCount,
                timestamp: new Date(),
                spotId: data.spotId
            }
        })
        res.send(results)
    } catch (err) {
        res.send(generateErrorPayload(err))

    }
})

app.post('/add_menu_item', async (req, res) => {
    try {
        if (req.isAuthenticated()) {
            let data = req.body;
            let response = await prisma.spot.findUnique({
                where: {
                    spotId: data['spotId']
                }
            })
            if (!response) {
                throw Error("Invalid spotId")
            }

            if (response.adminEmail !== req.user.email) {
                throw Error("You are not authorised to add a new menu to this store")
            }
            data['image'] = `https://source.unsplash.com/random?sig=${Date.now()}`
            let results = await prisma.meal.create({
                data
            })

            res.send({
                error: false,
                data: results
            })
        } else {
            throw Error("User not authenticated");
        }

    } catch (err) {
        res.send(generateErrorPayload(err))

    }
})

export default app;

