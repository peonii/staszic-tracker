import { Bot } from "../../bot/bot";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Command, SlashCommand } from "../../types/command";
import { fetchStopLines, readCachedStops } from "../../lib/warsaw";
import { getLocationOfStop } from "../../lib/warsaw/getLocationOfStop";

@SlashCommand('randomstop', 'Select a random stop')
class RandomStopCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        const stops = readCachedStops()

        const randomIndex = Math.floor(Math.random() * stops.length)
        const stop = stops[randomIndex]
        const fullstop = await fetchStopLines(stop)
        const region = await getLocationOfStop(fullstop)


        const embed = new EmbedBuilder()
            .setTitle(`${stop.name} ${stop.pole}`)
            .addFields(
                { name: 'Lines', value: `${fullstop.lines?.join(', ') || '*failed to fetch*'}` },
                { name: 'District', value: `${region}` }
        )
        
        const locationLink = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Location')
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://google.com/maps/@' + stop.latitude + ',' + stop.longitude + ',20z')
        )

        interaction.editReply({ embeds: [embed], components: [locationLink] })

    }
}

const instance = new RandomStopCommand()
export { instance }