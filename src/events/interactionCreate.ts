import { Client, Interaction, InteractionType } from "discord.js"
import logger from "../logger"
import { handleCommand } from "../lib/commandHandler"

const name = 'interactionCreate'

const run = (client: Client, interaction: Interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand)
        handleCommand(client, interaction)
    if (interaction.type === InteractionType.ModalSubmit)
        interaction.reply({ ephemeral: true, content: ':white_check_mark:' })
}

const once = false

export {
    name, run, once
}