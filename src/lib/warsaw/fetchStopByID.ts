import { fetchStopLines } from "./fetchStopLines";
import { readCachedStops } from "./readCachedStops";
import { Stop } from "./types";

export async function fetchStopByID(id: string) {
    const cache = readCachedStops()

    const stops = cache.filter(stop => {
        try {
            return stop.id === id
        } catch (_) {
            return false
        }
    }) // this is so painful

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

        globalStop.lines?.concat(stopLines.lines as string[])
    }

    return globalStop
}