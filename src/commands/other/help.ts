import { ChatInputCommandInteraction } from "discord.js"
import { getCommandCategories } from "../../utils/filescan"
import path from 'node:path'
import { Bot } from "../../bot/bot"
import { Command } from "../../types/command"

class HelpCommand extends Command {
    async init() {
        this.data
            .setName('help')
            .setDescription('Help command')
    }

    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        const categories = await getCommandCategories(path.join(__dirname, '..'))

        let messageString = ''

        const commands = categories.map(category => {
            messageString += '**' + category.meta.name + ' commands**\n'
            category.commands.forEach(command => {
                messageString += '`/' + command.data.name + '` - ' + command.data.description + '\n'
            })
        })

        interaction.reply(messageString)
    }
}

const instance = new HelpCommand()
export { instance }
