import fs from 'node:fs'
import { Stop } from './types'

export function readCachedStops() {
    const stops = JSON.parse(fs.readFileSync('./warszawa.json').toString('utf-8')) as Stop[]

    return stops
}