import { Stop } from "./types";

export async function getLocationOfStop(stop: Stop): Promise<string> {
    const endpoint = 'https://maps.googleapis.com/maps/api/geocode/json'
        + `?latlng=${stop.latitude},${stop.longitude}`
        + `&key=${process.env.MAPS_APIKEY}`

    const response = await fetch(endpoint)

    if (!response.ok) throw new Error('An error occured while fetching stop location! - status code ' + response.status)

    const data = await response.json()

    const results = data.results as Array<any>

    const region = results[0].address_components
    const f = region.filter((v: any) => v.types.includes('sublocality_level_1'))

    try {
        return f[0].long_name
    }
    catch (err) {
        return 'Strefa II'
    }
}