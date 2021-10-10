import { PrismaClient } from '.prisma/client';
import axios from 'axios'

const resourseUrl = 'https://dining.columbia.edu/cu_dining/rest/meals?1633558414';
let prisma = new PrismaClient();



export const addMealsInfo = async () => {
    let res = await axios.get(resourseUrl)
    let meals: any = res.data;

    console.log(meals)

    for (let meal of meals) {
        if (!meal['description']) continue;
        
        const spotId = Math.floor(Math.random() * 245) % 10 + 1;
        await prisma.meal.create({
            data: {
                spotId,
                description: meal['description'],
                title: meal['title'],
                saturated_fat: (Math.random() * 40).toFixed(3),
                image: '/images/default-meal.png',
                sodium: (Math.random() * 9).toFixed(3),
                total_fat: (Math.random() * 12).toFixed(3),
                total_dietary_fiber: (Math.random() * 15).toFixed(3),
                total_protein: (Math.random() * 23).toFixed(3),
                total_carbohydrate: (Math.random() * 4).toFixed(3),
                total_carbon: (Math.random() * 5).toFixed(3),
                total_water_used: (Math.random() * 24).toFixed(3),
            }
        })
    }


}