import { Bot } from "../bot/bot";
import { Client, CommandInteraction } from "discord.js";
import logger from "../utils/logger";

const handleCommand = (bot: Bot, interaction: CommandInteraction) => {
    const commandName = interaction.commandName

    const command = bot.commands.get(commandName)

    if (!command) {
        logger.error('Command not found???')
    }

    try {
        command?.run(bot, interaction)
    } catch (err) {
        logger.error('Error running command ' + commandName)
        logger.error(err)
    }
}

export { handleCommand }