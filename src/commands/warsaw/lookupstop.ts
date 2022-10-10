import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    AttachmentBuilder,
    ButtonInteraction,
} from "discord.js";
import { fetchMapBuffer, getStopByName, readCachedStops } from "../../lib/warsaw";
import { Bot } from "../../bot/bot";
import { Command, SlashCommand, StringArgument } from "../../types/command";

@StringArgument('name', 'The stop name')
@SlashCommand('lookupstop', 'Look up a stop by its name!')
class LookupStopCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        const name = interaction.options.getString('name') as string
        let stop
        stop = await getStopByName(name)
        // search for stops with similar names and suggest them

        if (!stop) {
            const stops = readCachedStops()
            let stopName = name
            let stopsFiltered = stops.filter(stop => {
                return stop.name.toLowerCase().includes(name.toLowerCase())
            })


            // if it doesn't match any stops, shorten the name and try again
            await interaction.editReply('No stop found! Looking for similar names...')
            while (stopsFiltered.length === 0 && stopName.length > 0) {
                stopName = stopName.slice(0, -1)
                stopsFiltered = stops.filter(stop => {
                    return stop.name.toLowerCase().includes(stopName.toLowerCase())
                })
            } 
            
            // remove duplicates by name
            stopsFiltered = stopsFiltered.filter((stop, index, self) => {
                return index === self.findIndex((t) => {
                    return t.name === stop.name
                })
            })

            let thisVariableSucks = true

            if (stopsFiltered.length === 1) {
                stop = await getStopByName(stopsFiltered[0].name)

                if (stop) { 
                    const actionRow = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('fetchyes')
                                .setLabel('Yes')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('fetchno')
                                .setLabel('No')
                                .setStyle(ButtonStyle.Danger)
                        )

                    const filter: any = (i: ButtonInteraction) => (i.customId === 'fetchyes' || i.customId === 'fetchno') && i.user.id === interaction.user.id
                    const buttonInteraction = await interaction.channel?.createMessageComponentCollector({ filter, time: 15000 })
                    await interaction.editReply({ content: `Found a stop with a similar name: ${stopsFiltered[0].name}. Is this the stop you're looking for?`, components: [actionRow] })

                    buttonInteraction?.on('collect', async (i: any) => {
                        if (i.customId === 'fetchyes') {
                            await i.reply({ content: ':white_check_mark:' })
                            await interaction.editReply({ embeds: [], components: [], content: 'Fetching stop ' + stopsFiltered[0].name })
                            thisVariableSucks = false
                            await i.deleteReply()
                            await buttonInteraction.stop()
                        } else {
                            await i.reply({ content: `:x:` })
                            await interaction.editReply({ embeds: [], components: [] })
                            await i.deleteReply()
                            await buttonInteraction.stop()
                        }
                    })

                    let hasUserResponded = false

                    buttonInteraction?.on('end', () => {
                        hasUserResponded = true
                    })


                    // do not proceed while the user hasnt responded
                    while (!hasUserResponded) {
                        await new Promise(r => setTimeout(r, 1000))
                    }
                }
            }

            if (thisVariableSucks) {
                let suggestions = stopsFiltered.map(stop => stop.name).join(', ')
                // if filtered stops length is greater than 20, shorten it to 20
                if (stopsFiltered.length > 20) {
                    const l = stopsFiltered.length
                    stopsFiltered = stopsFiltered.slice(0, 20)
                    suggestions = stopsFiltered.map(stop => stop.name).join(', ') + '... (' + (l - 20) + ' more)'
                }

                await interaction.editReply({
                    content: 'No stop found with the name `' + name + '`. Did you mean one of these? \n' + suggestions,
                    components: []
                })

                return
            }
        }

        if (!stop) return // this is unreachable

        const relativeCreationDate = new Date(stop.creationDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

        const buffer = await fetchMapBuffer(stop)

        const file = new AttachmentBuilder(buffer, { 
            name: 'map.png',
        })

        const joinedStopLines = stop.lines?.join(', ')


        const embed = new EmbedBuilder()
            .setTitle(`${stop.name}`)
            .addFields(
                { name: 'ID', value: `${stop.id}` },
                { name: 'Lines', value: `${ (joinedStopLines != null) ? joinedStopLines : '*none*'}` },
            )
            .setFooter({
                'text': `Powered by UM Warszawa API - Valid since ${relativeCreationDate}`
            })
            .setColor('#aaaaff')
            .setTimestamp(new Date())
            .setImage('attachment://map.png')
        
        const locationActionRow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Location')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://google.com/maps/@' + stop.latitude + ',' + stop.longitude + ',19z'),
            )

        await interaction.editReply({ content: '', embeds: [embed], components: [ locationActionRow ], files: [file] })

    }
}

const instance = new LookupStopCommand()
export { instance }