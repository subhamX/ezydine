import { addSpots } from './add_spots'
import { normalizeLogs } from './normalize_logs'
import fs from 'fs'
import path from 'path'
import { addMealsInfo } from './add_meals_info';


// ! NOTE: Comment the ones which you don't want to execute
(async () => {
    try {

        // await addSpots();
        // add logs at same level as package.json
        // await normalizeLogs(fs.readFileSync(path.join('logs.txt'), { encoding: 'utf-8' }))

        addMealsInfo();
    } catch (err) {
        console.log(err.message);
    }
})();

