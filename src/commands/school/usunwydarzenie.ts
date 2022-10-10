import { Command, RequirePermissions, SlashCommand, StringArgument } from "../../types/command";
import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Bot } from "../../bot/bot";

@StringArgument('id', 'ID Wydarzenia')
@RequirePermissions(PermissionFlagsBits.Administrator)
@SlashCommand('usunwydarzenie', 'Usuń wydarzenie z bazy danych')
class UsunWydarzenieCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        const id = interaction.options.getString('id')

        if (id == null) return interaction.reply('Brak podanego ID!')
        
        try {
            const deleted = await bot.prisma.assignment.delete({
                where: {
                    id
                }
            })

            return interaction.reply(`Usunieto wydarzenie ${deleted.name} \n(id: ${deleted.id})`)
        } catch (err) {
            return interaction.reply('Nie znaleziono wydarzenia o podanym ID!')
        }
    }
}

const instance = new UsunWydarzenieCommand()
export { instance }