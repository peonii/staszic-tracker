import { Command } from "../../types/command";
import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Bot } from "../../bot/bot";

class UsunWydarzenieCommand extends Command {
    async init() {
        this.data
            .setName('usunwydarzenie')
            .setDescription('Usuń wydarzenie z bazy danych')
            .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
            .addStringOption(
                o => o.setName('id')
                    .setDescription('ID Wydarzenia')
                    .setRequired(true))
    }

    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        const id = interaction.options.getString('id')

        if (!id) return interaction.reply('Brak podanego ID!')
        
        try {
            const deleted = await bot.prisma.assignment.delete({
                where: {
                    id
                }
            })
            if (!deleted) return interaction.reply('Nie znaleziono wydarzenia o podanym ID!')

            return interaction.reply(`Usunieto wydarzenie ${deleted.name} \n(id: ${deleted.id})`)
        } catch (err) {
            return interaction.reply('Nie znaleziono wydarzenia o podanym ID!')
        }
    }
}

const instance = new UsunWydarzenieCommand()
export { instance }