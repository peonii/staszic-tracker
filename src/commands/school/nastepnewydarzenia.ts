import { Bot } from "../../bot/bot";
import { User } from "@prisma/client";
import { ChatInputCommandInteraction } from "discord.js";
import { getAssignmentName } from "../../lib/assignments";
import { Command, SlashCommand } from "../../types/command";

@SlashCommand('nastepnewydarzenia', 'Sprawdź następne wydarzenia')
class NastepneWydarzeniaCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        const events = await bot.prisma.assignment.findMany({
            where: {
                date: {
                    gte: new Date()
                }
            },
            orderBy: {
                date: 'asc'
            }
        })

        let user: User
        try {
            user = await bot.prisma.user.findFirstOrThrow({
                where: {
                    id: interaction.user.id
                }
            })
        } catch (err) {
            user = await bot.prisma.user.create({
                data: {
                    id: interaction.user.id
                }
            })
        }

        if (!user) return interaction.reply('Coś poszło nie tak!')

        if (events.length === 0) {
            return interaction.reply('Brak następnych wydarzeń')
        }
        return interaction.reply(
            'Następne wydarzenia:\n\n' + 
            events.map(e =>
                `${user.assignmentsCompleted.includes(e.id) ? ':white_check_mark:' : ':x:'} ` +
                `${getAssignmentName(e.type)[0].toUpperCase() + getAssignmentName(e.type).slice(1)}\n` +
                `**${e.name}** - ` +
                `${e.date.getDate()}/${e.date.getMonth() + 1}/${e.date.getFullYear()}` +
                `\n${e.description}` +
                `\n*ID: ${e.id}*`
            ).join('\n\n')
        )
    }
}

const instance = new NastepneWydarzeniaCommand()
export { instance }