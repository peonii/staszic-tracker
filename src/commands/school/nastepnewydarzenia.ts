import { AssignmentType, PrismaClient, User } from "@prisma/client";
import { ChatInputCommandInteraction, Client, CommandInteraction, PermissionFlagsBits, SlashCommandBuilder, TextInputBuilder, ModalBuilder, TextInputStyle, ModalActionRowComponentBuilder, ActionRowBuilder } from "discord.js";
import { getAssignmentName } from "../../lib/assignments";
import logger from "../../logger";
import Command from "../../types/command";

const data = new SlashCommandBuilder()
    .setName('nastepnewydarzenia')
    .setDescription('Sprawdź następne wydarzenia')

const run = async (client: Client, interaction: ChatInputCommandInteraction) => {
    const prisma = new PrismaClient()

    const events = await prisma.assignment.findMany({
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
        user = await prisma.user.findFirstOrThrow({
            where: {
                id: interaction.user.id
            }
        })
    } catch (err) {
        user = await prisma.user.create({
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

export { data, run }