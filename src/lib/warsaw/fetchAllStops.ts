import { APIStops, Stop } from "./types"

/**
 * THIS FUNCTION IS VERY SLOW
 * I recommend using it once a day, and caching the result
 */
export async function fetchAllStops(): Promise<Stop[]> {
    const warsawAPIEndpoint = 'https://api.um.warszawa.pl/api/action/dbstore_get?id=ab75c33d-3a26-4342-b36a-6e5fef0a3ac3&apikey=' + process.env.UMW_APIKEY

    const stopsRes = await fetch(warsawAPIEndpoint) 
    if (!stopsRes.ok) throw new Error('An error occured while fetching all stops! - status code ' + stopsRes.status)

    const stops = (await stopsRes.json()) as APIStops
    const stopsParsed: Array<Stop> = []

    // transmute the stops to an actual readable format
    for (const stop of stops.result) {
        const stopUnmapped: any = {
            zespol: '',
            slupek: '',
            nazwa_zespolu: '',
            id_ulicy: '',
            szer_geo: '',
            dlug_geo: '',
            kierunek: '',
            obowiazuje_od: ''
        }
        stop.values.map(vals => stopUnmapped[vals.key] = vals.value)

        const stopMapped: Stop = {
            id: stopUnmapped.zespol,
            pole: stopUnmapped.slupek,
            name: stopUnmapped.nazwa_zespolu,
            streetId: stopUnmapped.id_ulicy,
            latitude: stopUnmapped.szer_geo,
            longitude: stopUnmapped.dlug_geo,
            direction: stopUnmapped.kierunek,
            creationDate: stopUnmapped.obowiazuje_od
        }

        stopsParsed.push(stopMapped)
    }

    return stopsParsed
}