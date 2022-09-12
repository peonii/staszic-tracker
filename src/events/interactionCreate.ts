import { Bot } from "../bot/bot"
import { Interaction, InteractionType } from "discord.js"
import { handleCommand } from "../lib/commandHandler"
import { DiscordEvent } from "../types/event"

@DiscordEvent('interactionCreate')
class InteractionCreateEvent {
    async run(bot: Bot, interaction: Interaction) {
        if (interaction.type === InteractionType.ApplicationCommand)
            handleCommand(bot, interaction)
        if (interaction.type === InteractionType.ModalSubmit)
            interaction.reply({ ephemeral: true, content: ':white_check_mark:' })
    }
}

const event = new InteractionCreateEvent()
export { event }