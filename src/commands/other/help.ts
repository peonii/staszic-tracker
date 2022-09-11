import { ChatInputCommandInteraction, Client,  SlashCommandBuilder } from "discord.js"
import { getCommandCategories } from "../../utils/filescan"
import path from 'node:path'
import { Bot } from "../../bot/bot"

const data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help command')

const run = async (bot: Bot, interaction: ChatInputCommandInteraction) => {
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

export { data, run }