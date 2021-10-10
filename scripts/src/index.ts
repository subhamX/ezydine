import { addSpots } from './add_spots'
import { normalizeLogs } from './normalize_logs'
import fs from 'fs'


// ! NOTE: Comment the ones which you don't want to execute
(async () => {
    try{
        await addSpots();
        await normalizeLogs(fs.readFileSync('./logs.txt', { encoding: 'utf-8' }))
    }catch(err){
        console.log(err.message);
    }
})();

