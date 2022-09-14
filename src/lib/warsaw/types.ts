export interface Stop {
    id: string
    pole: string
    name: string
    streetId: string
    latitude: string
    longitude: string
    direction: string
    creationDate: string
    lines?: string[]
}

export interface APIKeyValuePair {
    value: string
    key: string
}

export interface APIStop {
    values: APIKeyValuePair[]
}

export interface APIStops {
    result: APIStop[]
}

export interface APIStopLines {
    result: APILine[]
}

export interface APILine {
    values: APIKeyValuePair[]
}