import { Message } from "discord.js";
import { Bot } from "../bot/bot";
import { DiscordEvent } from "../types/event";

@DiscordEvent('messageCreate')
class MessageCreateEvent {
    async run(bot: Bot, message: Message) {
        if (message.content.includes('nigger')) {
            return message.react('👍')
        }
    }
}

const event = new MessageCreateEvent()
export { event }