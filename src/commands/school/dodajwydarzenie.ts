import { Bot } from '../../bot/bot';
import { AssignmentType } from "@prisma/client";
import { ChatInputCommandInteraction, PermissionFlagsBits, TextInputBuilder, ModalBuilder, TextInputStyle, ModalActionRowComponentBuilder, ActionRowBuilder, EmbedBuilder } from "discord.js";
import { getAssignmentType } from "../../lib/assignments";
import logger from "../../utils/logger";
import { Command, SlashCommand, StringArgument } from '../../types/command';

@StringArgument(
    'typ', 'Typ wydarzenia', true,
    [
        { name: 'Sprawdzian', value: 'sprawdzian' },
        { name: 'Praca Domowa', value: 'praca domowa' },
        { name: 'Kartkówka', value: 'kartkowka' },
        { name: 'Wypracowanie', value: 'wypracowanie' },
        { name: 'Prezentacja', value: 'prezentacja' },
        { name: 'Odpowiedź Ustna', value: 'odpowiedź ustna' }
    ]
)
@StringArgument('data', 'Data wydarzenia')
@SlashCommand('dodajwydarzenie', 'Dodaj wydarzenie do bazy danych')
class DodajWydarzenieCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        const typ = interaction.options.getString('typ')
        const data = interaction.options.getString('data')
        
        //interaction.deferReply()

        if (!typ || !data) {
            return interaction.reply('Nie podano wszystkich danych!')
        }

        const actualDate = new Date(Date.parse(data))

        const modal = new ModalBuilder()
            .setCustomId('eventadd')
            .setTitle('Dodaj wydarzenie')

        const name = new TextInputBuilder()
            .setCustomId('event-name')
            .setLabel('Nazwa wydarzenia')
            .setStyle(TextInputStyle.Short)

        const content = new TextInputBuilder()
            .setCustomId('event-description')
            .setLabel('Opis wydarzenia')
            .setStyle(TextInputStyle.Paragraph)
        
        const actionRowOne = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(name)
        const actionRowTwo = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(content)

        modal.addComponents(actionRowOne, actionRowTwo)

        logger.info('Showing modal')
        await interaction.showModal(modal)
        const modalInteraction = await interaction.awaitModalSubmit({
            filter: (i) => {
                return true
            },
            time: 240000
        })

        const nameValue = modalInteraction.fields.getTextInputValue('event-name')
        const contentValue = modalInteraction.fields.getTextInputValue('event-description')

        if (!nameValue || !contentValue) {
            return interaction.followUp('Nie podano wszystkich danych!')
        }
        
        let actualType: AssignmentType = getAssignmentType(typ)

        const event = await bot.prisma.assignment.create({
            data: {
                name: nameValue,
                description: contentValue,
                date: actualDate,
                type: actualType
            }
        })

        const embed = new EmbedBuilder()
            .setTitle(':white_check_mark: Dodano wydarzenie!')
            .setDescription(`**${event.name}**\n${event.description}`)
            .setTimestamp(event.date)
            .setColor('#00ff00')

        return interaction.followUp({ embeds: [embed] })
    }
}

const instance = new DodajWydarzenieCommand()
export { instance }