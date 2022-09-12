import { Bot } from "../bot/bot"

export function DiscordEvent(name: string, once: boolean = false) {
    return function (constructor: Function) {
        constructor.prototype.once = once
        constructor.prototype.name = name
    }
}