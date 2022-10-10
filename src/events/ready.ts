import { ActivityType, Client } from "discord.js"
import { initLibrus } from "../lib/noticeManager"
import { Bot } from "../bot/bot"
import { DiscordEvent } from "../types/event"
import config from '../../bot.config'
@DiscordEvent('ready', true)
class ReadyEvent {
    async run(bot: Bot, client: Client) {
        console.log(`Logged in as ${client.user?.tag}`)
        
        if (config.enabledFeatures.librus) {
            console.log('Logging in to librus...')
            // Validate username, password and push device
            if (process.env.LIBRUS_USERNAME == null) {
                console.error(`No LIBRUS_USERNAME environment variable set!`)
                process.exit(1)
            }

            if (process.env.LIBRUS_PASSWORD == null) {
                console.error(`No LIBRUS_PASSWORD environment variable set!`)
                process.exit(1)
            }

            if (process.env.LIBRUS_PUSH_DEVICE == null) {
                console.error(`No LIBRUS_PUSH_DEVICE environment variable set!`)
                console.error('You can generate a push device by running: yarn newdevice')
                process.exit(1)
            }

            await bot.librus.login(
                (process.env.LIBRUS_USERNAME !== "") ? process.env.LIBRUS_USERNAME : '',
                (process.env.LIBRUS_PASSWORD !== "") ? process.env.LIBRUS_PASSWORD : ''
            )
            bot.librus.pushDevice = parseInt((process.env.LIBRUS_PUSH_DEVICE !== "") ? process.env.LIBRUS_PUSH_DEVICE : '0')
            await initLibrus(bot)
        }

        bot.client.user?.setPresence({
            activities: [
                {
                    name: 'Zmysło',
                    type: ActivityType.Watching
                }
            ],
            status: 'dnd'
        })

    }
}

const event = new ReadyEvent()
export { event }