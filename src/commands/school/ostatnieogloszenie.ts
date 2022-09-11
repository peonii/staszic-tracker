import { Bot } from "../../bot/bot";
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { NoticeManager } from "librus";

const data = new SlashCommandBuilder()
    .setName('ostatnieogloszenie')
    .setDescription('Ostatnie ogloszenie')

const run = async (bot: Bot, interaction: ChatInputCommandInteraction) => {
    interaction.deferReply()
    const noticeManager = new NoticeManager(bot.librus)

    const notices = noticeManager.fetchAll()

    const notice = (await notices).pop()

    interaction.editReply(`${notice?.Id}`)
}

export { data, run }