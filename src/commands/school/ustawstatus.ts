import { Bot } from "../../bot/bot";
import { ChatInputCommandInteraction, PermissionFlagsBits } from "discord.js";
import { Command } from "../../types/command";

class UstawStatusCommand extends Command {
    async init() {
        this.data
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
    }

    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        const id = interaction.options.getString('id')
        const status = interaction.options.getBoolean('status')

        if (!id) return interaction.reply('Brak podanego ID!')
        
        let user = await bot.prisma.user.findFirst({
            where: {
                id: interaction.user.id
            }
        })

        if (!user) {
            user = await bot.prisma.user.create({
                data: {
                    id: interaction.user.id,
                }
            })
        }

        try {
            const assignment = await bot.prisma.assignment.findFirst({
                where: {
                    id
                }
            })
            if (!assignment) return interaction.reply('Nie znaleziono wydarzenia o podanym ID!')

            if (status) {
                if (user.assignmentsCompleted.includes(assignment.id))
                    return interaction.reply(`Już wykonał${interaction.user.id === '277016821809545216' ? 'a' : 'x'}ś to wydarzenie!`)
                await bot.prisma.user.update({
                    where: {
                        id: interaction.user.id
                    },
                    data: {
                        assignmentsCompleted: {
                            push: assignment.id
                        }
                    }
                })

                return interaction.reply(`Ustawiono status wydarzenia ${assignment.name} na ${status ? '' : 'nie'}ukończone!`)
            } else {
                if (!user.assignmentsCompleted.includes(assignment.id))
                    return interaction.reply(`Nie wykonał${interaction.user.id === '277016821809545216' ? 'a' : 'x'}ś tego wydarzenia!`)
            
                const newArr = user.assignmentsCompleted.filter(id => id !== assignment.id)
                
                await bot.prisma.user.update({
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
}

const instance = new UstawStatusCommand()
export { instance }