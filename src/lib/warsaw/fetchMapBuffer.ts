import { Stop } from "./types";

export async function fetchMapBuffer(stop: Stop) {
    const staticMapsEndpoint = 'https://maps.googleapis.com/maps/api/staticmap'
        + '?center=' + stop.latitude + ',' + stop.longitude
        + '&zoom=17'
        + '&size=500x500'
        + '&maptype=roadmap'
        + '&format=png'
        + '&markers=color:red%7Csize:mid%7C' + stop.latitude + ',' + stop.longitude
    
    const map = await fetch(staticMapsEndpoint + '&key=' + process.env.MAPS_APIKEY)

    const abuffer = await map.arrayBuffer()

    const buffer = Buffer.from(abuffer)

    return buffer
}