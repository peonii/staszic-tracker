import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "../types/command";

const data = new SlashCommandBuilder()
    .setName('test')
    .setDescription('Test command')

const run = async (client: Client, interaction: CommandInteraction) => {
    interaction.reply('ok')
}

export { data, run }