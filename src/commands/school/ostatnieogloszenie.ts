import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { NoticeManager } from "librus";
import librusClient from '../../lib/librusClient'

const data = new SlashCommandBuilder()
    .setName('ostatnieogloszenie')
    .setDescription('Ostatnie ogloszenie')

const run = async (client: Client, interaction: ChatInputCommandInteraction) => {
    interaction.deferReply()
    const noticeManager = new NoticeManager(librusClient)

    const notices = noticeManager.fetchAll()

    const notice = (await notices).pop()

    interaction.editReply(`${notice?.Id}`)
}

export { data, run }