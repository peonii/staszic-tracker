import { APILine, APIStopLines, Stop } from "./types";

export async function fetchStopLines(stop: Stop): Promise<Stop> {
    let endpoint = 'https://api.um.warszawa.pl/api/action/dbtimetable_get?id=88cd555f-6f31-43ca-9de4-66c479ad5942'
    endpoint += '&busstopId=' + stop.id
    endpoint += '&busstopNr=' + stop.pole
    endpoint += '&apikey=' + process.env.UMW_APIKEY

    const linesRes = await fetch(endpoint)
    if (!linesRes.ok) throw new Error('An error occured while fetching stop lines! - status code ' + linesRes.status)

    const lines = (await linesRes.json()) as APIStopLines
    const linesArray = []

    for (const line of lines.result) {
        linesArray.push(line.values[0].value)        
    }

    return { ...stop, lines: linesArray }
}