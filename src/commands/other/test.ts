import { Bot } from "../../bot/bot";
import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

const data = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test command')

const run = async (bot: Bot, interaction: CommandInteraction) => {
    interaction.reply('ok')
}

export { data, run }