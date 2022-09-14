import cron from 'cron'
import { fetchAllStops } from '../lib/warsaw'
import fs from 'node:fs'

const cacheStops = new cron.CronJob(
    '0 0 * * *',
    async () => {
        const stops = await fetchAllStops()

        fs.writeFileSync('./warszawa.json', JSON.stringify(stops))
    }
)

export default async function () {
    cacheStops.start()
}