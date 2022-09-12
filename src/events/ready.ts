import logger from "../utils/logger"
import { ActivityType, Client, Interaction, InteractionType } from "discord.js"
import { initLibrus } from "../lib/noticeManager"
import { Bot } from "../bot/bot"
import { DiscordEvent } from "../types/event"
@DiscordEvent('ready', true)
class ReadyEvent {
    async run(bot: Bot, _client: Client) {
        logger.info(`Logged in as ${bot.client.user?.tag}`)

        // Validate username, password and push device
        if (!process.env.LIBRUS_USERNAME) {
            logger.error(`No LIBRUS_USERNAME environment variable set!`)
            process.exit(1)
        }

        if (!process.env.LIBRUS_PASSWORD) {
            logger.error(`No LIBRUS_PASSWORD environment variable set!`)
            process.exit(1)
        }

        if (!process.env.LIBRUS_PUSH_DEVICE) {
            logger.error(`No LIBRUS_PUSH_DEVICE environment variable set!`)
            logger.error('You can generate a push device by running: yarn newdevice')
            process.exit(1)
        }

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
}

const event = new ReadyEvent()
export { event }