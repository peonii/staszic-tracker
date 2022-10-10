import { Bot } from "../bot/bot"



export function DiscordEvent(name: string, once = false) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (constructor: Function) {
        constructor.prototype.once = once
        constructor.prototype.name = name
    }
}

export interface DiscordEventType {
    name: string
    once: boolean
    run: (bot: Bot, ...args: unknown[]) => void
}