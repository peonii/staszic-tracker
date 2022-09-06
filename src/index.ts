import { ActivityType, Client, Collection } from 'discord.js'
import intents from "@/config/gateway_intents"
import dotenv from 'dotenv'
import { Command } from '@/types/command'
import path from 'node:path'
import fs from 'node:fs'
import logger from '@/utils/logger'
import { getCommandCategories } from '@/utils/filescan'

dotenv.config()

const client = new Client({ intents })

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>
    }
}

client.commands = new Collection<string, Command>()


async function initializeCommands() {
    const commandsPath = path.join(__dirname, 'commands')
    const categories = await getCommandCategories(commandsPath)

    for (const category of categories) {
        for (const command of category.commands) {
            client.commands.set(command.data.name, command)
            logger.info(`Loaded command ${category.meta.name}/${command.data.name}`)
        }
    }
}

async function initializeEvents() {
    const eventsPath = path.join(__dirname, 'events')
    const eventFiles = fs.readdirSync(eventsPath)

    for (const file of eventFiles) {
        const event = await import(path.join(eventsPath, file))
        if (event.once) {
            client.once(event.name, (...args) => event.run(client, ...args))
        } else {
            client.on(event.name, (...args) => event.run(client, ...args))
        }
        logger.info(`Loaded event ${event.name}`)
    }
}

client.once('ready', async () => {
    logger.info(`Logged in as ${client.user?.tag}`)
    await initializeCommands()
    await initializeEvents()
    client.user?.setPresence({
        activities: [
            {
                name: 'Zmysło',
                type: ActivityType.Watching
            }
        ],
        status: 'dnd'
    })
})

client.login(process.env.BOT_TOKEN)