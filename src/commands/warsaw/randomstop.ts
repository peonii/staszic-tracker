import { Bot } from "../../bot/bot";
import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Command, SlashCommand } from "../../types/command";
import { fetchStopLines, readCachedStops } from "../../lib/warsaw";
import { getLocationOfStop } from "../../lib/warsaw";

@SlashCommand('randomstop', 'Select a random stop')
class RandomStopCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        const stops = readCachedStops()

        const randomIndex = Math.floor(Math.random() * stops.length)


        const row = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('fetchmoredata')
                    .setLabel('Fetch more data...')
                    .setEmoji('🔄')
                    .setStyle(ButtonStyle.Primary),
            )

        const locationLink = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Location')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://google.com/maps/@' + stops[randomIndex].latitude + ',' + stops[randomIndex].longitude + ',19z')
            )
        
        const embedPartial = new EmbedBuilder()
            .setTitle(`${stops[randomIndex].name} ${stops[randomIndex].pole}`)
            .addFields(
                { name: 'Lines', value: '*click the button below to fetch*' },
                { name: 'District', value: '*click the button below to fetch*' }
            )

        await interaction.editReply({
            embeds: [ embedPartial ],
            components: [ row, locationLink ]
        })
        
        const filter = (i: any) => i.customId === 'fetchmoredata' && i.user.id === interaction.user.id
        const buttonInteraction = await interaction.channel?.createMessageComponentCollector({ filter, time: 20000 })

        buttonInteraction?.on('collect', async (i: ButtonInteraction) => {
            await i.reply({ content: 'Fetching additional data!' })
            const stop = await fetchStopLines(stops[randomIndex])
            const region = await getLocationOfStop(stop)

            const joinedStopLines = stop.lines?.join(', ')

            const embedFull = new EmbedBuilder()
                .setTitle(`${stop.name} ${stop.pole}`)
                .addFields(
                    { name: 'Lines', value: `${(joinedStopLines != null) ? joinedStopLines : '*none*'}` },
                    { name: 'District', value: `${region}` }
                )

            await interaction.editReply({ embeds: [embedFull], components: [ locationLink ] })
            await i.deleteReply()
            await buttonInteraction.stop()
        })


        buttonInteraction?.on('end', async (collected) => {
            if (collected.size === 0) {
                const embedPartialFinal = new EmbedBuilder()
                    .setTitle(`${stops[randomIndex].name} ${stops[randomIndex].pole}`)
                await interaction.editReply({ embeds: [embedPartialFinal], components: [ locationLink ] })
            }
        })
    }
}

const instance = new RandomStopCommand()
export { instance }