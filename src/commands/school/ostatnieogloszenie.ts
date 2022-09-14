import { Bot } from "../../bot/bot";
import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";
import { NoticeManager } from "librus";
import { Command, SlashCommand } from "../../types/command";
import config from '../../../bot.config'

@SlashCommand('ostatnieogloszenie', 'ID ostatniego ogłoszenia na Librusie')
class OstatnieOgloszenieCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        if (config.enabledFeatures.librus) {
            const noticeManager = new NoticeManager(bot.librus)

            const notices = await noticeManager.fetchAll()

            const notice = notices.pop()

            interaction.editReply(`${notice?.Id}`)
        } else {
            interaction.editReply('Librus is currently disabled!')
        }
    }
}

const instance = new OstatnieOgloszenieCommand()
export { instance }
