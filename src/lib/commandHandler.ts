import { Bot } from "../bot/bot";
import { Client, ChatInputCommandInteraction, CommandInteraction } from "discord.js";
import cfg from "../../bot.config";

const handleCommand = (bot: Bot, interaction: CommandInteraction) => {
    const commandName = interaction.commandName

    const command = bot.commands.get(commandName)

    if (!command) {
        console.error('Command not found???')
    }

    try {
        if (interaction instanceof ChatInputCommandInteraction) {
            if (!cfg.testingOptions.disableExecutingCommands) {
                command?.run(bot, interaction)
            }
            else {
                interaction.reply(':x: Command executing is disabled!')
            }
        }
    } catch (err) {
        console.error('Error running command ' + commandName)
        console.error(err)
        interaction.followUp('An error occured while running this command!')
    }
}

export { handleCommand }