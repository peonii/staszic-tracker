import { Stop } from "./types";
import { readCachedStops } from "./readCachedStops";
import { fetchStopLines } from "./fetchStopLines";
import logger from "../../utils/logger";

export async function getStopByName(name: string): Promise<Stop | undefined> {
    const cache = readCachedStops()

    const stops = cache.filter(stop => {
        try {
            return stop.name.toLowerCase() === name.toLowerCase()
        } catch (_) {
            return false
        }
    }) // this is so painful

    if (stops.length === 0) return undefined

    const globalStop: Stop = {
        id: stops[0].id,
        name: stops[0].name,
        pole: '', // we're setting the pole to "" because we're adding up all of the poles with the same id
        latitude: stops[0].latitude,
        longitude: stops[0].longitude,
        lines: [] as string[],
        streetId: stops[0].streetId,
        direction: stops[0].direction,
        creationDate: stops[0].creationDate
    }

    for (const stop of stops) {
        const stopLines = await fetchStopLines(stop) // time to get ratelimited :rejoice:

        if (!stopLines.lines) continue

        globalStop.lines = globalStop.lines?.concat(...stopLines.lines)
    }

    if (!globalStop.lines) return globalStop


    // sort from shortest to longest, then prioritize numbers over letters

    // written by github copilot :D
    globalStop.lines = globalStop.lines.sort((a, b) => {
        if (a.length === b.length) {
            if (isNaN(parseInt(a)) && isNaN(parseInt(b))) {
                return a.localeCompare(b)
            } else if (isNaN(parseInt(a))) {
                return 1
            } else if (isNaN(parseInt(b))) {
                return -1
            } else {
                return parseInt(a) - parseInt(b)
            }
        } else {
            return a.length - b.length
        }
    })
    // prune duplicates
    globalStop.lines = globalStop.lines.filter((line, index) => {
        return globalStop.lines?.indexOf(line) === index
    })

    return globalStop
}