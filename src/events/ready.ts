import logger from "../utils/logger"
import { ActivityType, Client, Interaction, InteractionType } from "discord.js"
import { initLibrus } from "../lib/noticeManager"
import { Bot } from "../bot/bot"

const name = 'ready'

const run = async (bot: Bot, interaction: Interaction) => {
    logger.info(`Logged in as ${bot.client.user?.tag}`)

    await bot.librus.login(process.env.LIBRUS_USERNAME || '', process.env.LIBRUS_PASSWORD || '')
    bot.librus.pushDevice = parseInt(process.env.LIBRUS_PUSH_DEVICE || '0')

    bot.client.user?.setPresence({
        activities: [
            {
                name: 'Zmysło',
                type: ActivityType.Watching
            }
        ],
        status: 'dnd'
    })

    initLibrus(bot)
}

const once = true

export {
    name, run, once
}