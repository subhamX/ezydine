import axios from "axios";

const crowdednessIdToEzyDineMap: any = {
    117: 1,
    116: 2,
    111: 3,
    110: 4,
    120: 5,
    125: 6,
    192: 7,
    155: 8,
    98: 9,
    926: 10,
}

const serverUrl = 'http://localhost:8000/spot/log_crowd/add';


/**
 * Function to normalize the logs scraped from https://dining.columbia.edu/
 * @param logsText 
 * @returns 
 */
export const normalizeLogs = async (logsText: string) => {
    let normalized_logs: any[] = []

    let logs = logsText.split('\n')
    for (let log of logs) {
        let data = log.split('\t')
        let indx = parseInt(data[1])
        let timestamp = parseInt(data[0]), spotId = crowdednessIdToEzyDineMap[indx], client_count = parseInt(data[2]);
        if (spotId) {
            console.log({
                spotId,
                timestamp,
                clientCount: client_count
            })
            await axios.post(serverUrl, {
                spotId,
                timestamp,
                clientCount: client_count
            })
        }
    }
    return normalized_logs
}