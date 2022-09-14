import { Bot } from "../../bot/bot";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { Command, SlashCommand } from "../../types/command";
import { fetchStopLines, readCachedStops } from "../../lib/warsaw";
import logger from "../../utils/logger";
import { getLocationOfStop } from "../../lib/warsaw/getLocationOfStop";
import fs from 'node:fs'

@SlashCommand('randomstop', 'Select a random stop')
class RandomStopCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        const stops = readCachedStops()

        const randomIndex = Math.floor(Math.random() * stops.length)

        const stop = await fetchStopLines(stops[randomIndex])
        const region = await getLocationOfStop(stop)

        const embed = new EmbedBuilder()
            .setTitle(`${stop.name} ${stop.pole}`)
            .addFields(
                { name: 'Lines', value: `${stop.lines?.join(', ') || '*failed to fetch*'}` },
                { name: 'District', value: `${region}` }
            )

        interaction.editReply({ embeds: [embed] })
    }
}

const instance = new RandomStopCommand()
export { instance }