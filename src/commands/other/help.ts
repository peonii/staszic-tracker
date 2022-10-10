import { ChatInputCommandInteraction } from "discord.js"
import { getCommandCategories } from "../../utils/filescan"
import path from 'node:path'
import { Bot } from "../../bot/bot"
import { SlashCommand, Command } from "../../types/command"

@SlashCommand('help', 'Help command')
class HelpCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        const categories = await getCommandCategories(path.join(__dirname, '..'))

        let messageString = ''
        categories.map(category => {
            messageString += '**' + category.meta.name + ' commands**\n'
            category.commands.forEach(command => {
                messageString += '`/' + command.data?.name + '` - ' + command.data?.description + '\n'
            })
        });
        messageString += `\n\nShards online: \`${bot.client.shard?.count}\``

        await interaction.reply(messageString)
    }
}

const instance = new HelpCommand()
export { instance }
