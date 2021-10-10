import { Spot } from ".prisma/client";
import dayjs from "dayjs";



export const checkSpotStatus = (spot: Spot) => {
    // TODO:
    const times = spot.timings.split("####");

    const currentTime = dayjs();
    times.forEach(e => {
        const [startTime, endTime] = e.split("___");

    })

    return "OPEN";
}