import { AssignmentType, PrismaClient } from "@prisma/client";
import { ChatInputCommandInteraction, Client, CommandInteraction, PermissionFlagsBits, SlashCommandBuilder, TextInputBuilder, ModalBuilder, TextInputStyle, ModalActionRowComponentBuilder, ActionRowBuilder } from "discord.js";
import logger from "../../logger";
import Command from "../../types/command";

const data = new SlashCommandBuilder()
    .setName('ustawstatus')
    .setDescription('Ustaw status wydarzenia')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(
        o => o.setName('id')
            .setDescription('ID Wydarzenia')
            .setRequired(true))
    .addBooleanOption(
        o => o.setName('status')
            .setDescription('Status wydarzenia')
            .setRequired(true))

const run = async (client: Client, interaction: ChatInputCommandInteraction) => {
    const prisma = new PrismaClient()

    const id = interaction.options.getString('id')
    const status = interaction.options.getBoolean('status')

    if (!id) return interaction.reply('Brak podanego ID!')
    
    let user = await prisma.user.findFirst({
        where: {
            id: interaction.user.id
        }
    })

    if (!user) {
        user = await prisma.user.create({
            data: {
                id: interaction.user.id,
            }
        })
    }

    try {
        const assignment = await prisma.assignment.findFirst({
            where: {
                id
            }
        })
        if (!assignment) return interaction.reply('Nie znaleziono wydarzenia o podanym ID!')

        if (status) {
            if (user.assignmentsCompleted.includes(assignment.id))
                return interaction.reply(`Już wykonał${interaction.user.id === '277016821809545216' ? 'a' : 'x'}ś to wydarzenie!`)
            await prisma.user.update({
                where: {
                    id: interaction.user.id
                },
                data: {
                    assignmentsCompleted: {
                        push: assignment.id
                    }
                }
            })
        } else {
            if (!user.assignmentsCompleted.includes(assignment.id))
                return interaction.reply(`Nie wykonał${interaction.user.id === '277016821809545216' ? 'a' : 'x'}ś tego wydarzenia!`)
        
            const newArr = user.assignmentsCompleted.filter(id => id !== assignment.id)
            
            await prisma.user.update({
                where: {
                    id: interaction.user.id
                },
                data: {
                    assignmentsCompleted: {
                        set: newArr
                    }
                }
            })

            return interaction.reply(`Ustawiono status wydarzenia ${assignment.name} na ${status ? '' : 'nie'}ukończone!`)
        }
    } catch (err) {
        return interaction.reply('Nie znaleziono wydarzenia o podanym ID!')
    }
}

export { data, run }