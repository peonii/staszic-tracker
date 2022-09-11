import { Command } from "../types/command";
import { Client, Collection } from "discord.js";
import intents from '../config/gateway_intents'
import path from 'node:path'
import fs from 'node:fs'
import logger from "../utils/logger";
import { getCommandCategories } from "../utils/filescan";
import { LibrusClient } from "librus";


export class Bot {
    client: Client
    commands: Collection<string, Command>
    librus: LibrusClient

    constructor() {
        this.client = new Client({ intents })
        this.commands = new Collection<string, Command>()
        this.librus = new LibrusClient()
    }

    async init() {
        await this.initEvents()
        await this.initCommands()

        if (!process.env.BOT_TOKEN) {
            logger.error('No BOT_TOKEN environment variable found!')
            process.exit(1)
        }

        await this.client.login(process.env.BOT_TOKEN)
    }

    async initEvents() {
        const eventsPath = path.join(__dirname, '..', 'events')
        const eventFiles = fs.readdirSync(eventsPath)

        for (const file of eventFiles) {
            const event = await import(path.join(eventsPath, file))
            if (event.once) {
                this.client.once(event.name, (...args) => event.run(this, ...args))
            } else {
                this.client.on(event.name, (...args) => event.run(this, ...args))
            }
            logger.info(`Loaded event ${event.name}`)
        }
    }

    async initCommands() {
        const commandsPath = path.join(__dirname, '..', 'commands')
        const categories = await getCommandCategories(commandsPath)

        for (const category of categories) {
            for (const command of category.commands) {
                this.commands.set(command.data.name, command)
                logger.info(`Loaded command ${category.meta.name}/${command.data.name}`)
            }
        }
    }
}

const bot = new Bot()

export { bot }