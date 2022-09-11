import { Bot } from "../bot/bot"
import { Client, Interaction, InteractionType } from "discord.js"
import { handleCommand } from "../lib/commandHandler"

const name = 'interactionCreate'

const run = (bot: Bot, interaction: Interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand)
        handleCommand(bot, interaction)
    if (interaction.type === InteractionType.ModalSubmit)
        interaction.reply({ ephemeral: true, content: ':white_check_mark:' })
}

const once = false

export {
    name, run, once
}