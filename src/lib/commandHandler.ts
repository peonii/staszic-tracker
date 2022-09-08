import { Client, CommandInteraction } from "discord.js";
import logger from "../utils/logger";

const handleCommand = (client: Client, interaction: CommandInteraction) => {
    const commandName = interaction.commandName

    const command = client.commands.get(commandName)

    if (!command) {
        logger.error('Command not found???')
    }

    try {
        command?.run(client, interaction)
    } catch (err) {
        logger.error('Error running command ' + commandName)
        logger.error(err)
    }
}

export { handleCommand }