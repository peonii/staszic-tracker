import { Bot } from "../../bot/bot";
import { ChatInputCommandInteraction } from "discord.js";
import { TimetableManager } from "librus";
import { Command, SlashCommand } from "../../types/command";
import config from '../../../bot.config'

@SlashCommand('ostatnieogloszenie', 'ID ostatniego ogłoszenia na Librusie')
class OstatnieOgloszenieCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        if (config.enabledFeatures.librus) {
            const timetableManager = new TimetableManager(bot.librus)

            const todaysTimetable = await timetableManager.fetchDay("2022-10-03")
            
            let response = ""

            todaysTimetable.forEach(entry => {
                if (entry[0] != null) {
                    const firstName = entry[0].Teacher.LastName.slice(0, 1) + entry[0].Teacher.FirstName.slice(1);
                    const lastName = entry[0].Teacher.FirstName.slice(0, 1) + entry[0].Teacher.LastName.slice(1);

                    response += `${entry[0].Subject.Name} (${firstName} ${lastName}) - ${entry[0].HourFrom} - ${entry[0].HourTo}\n`
                }
            })

            await interaction.editReply(response);           
        } else {
            await interaction.editReply('Librus is currently disabled!')
        }
    }
}

const instance = new OstatnieOgloszenieCommand()
export { instance }
