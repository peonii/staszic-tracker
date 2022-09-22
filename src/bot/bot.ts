import { Command } from "../types/command";
import { Client, Collection } from "discord.js";
import intents from '../config/gateway_intents'
import path from 'node:path'
import fs from 'node:fs'
import { getCommandCategories } from "../utils/filescan";
import { LibrusClient } from "librus";
import { PrismaClient } from "@prisma/client";
import cron from './cron'
import { fetchAllStops } from "../lib/warsaw";
import cfg from '../../bot.config'

export class Bot {
    client: Client
    commands: Collection<string, Command>
    librus: LibrusClient
    prisma: PrismaClient

    constructor() {
        this.client = new Client({ intents })
        this.commands = new Collection<string, Command>()
        this.librus = new LibrusClient()
        this.prisma = new PrismaClient()
    }

    async init() {
        await this.initEvents()
        await this.initCommands()

        if (!process.env.BOT_TOKEN) {
            //logger.error('No BOT_TOKEN environment variable found!')
            process.exit(1)
        }

        if (cfg.enabledFeatures.cacheStopsOnStartup) {
            const stops = await fetchAllStops()
            fs.writeFileSync('./warszawa.json', JSON.stringify(stops))
        }
        await this.client.login(process.env.BOT_TOKEN)

        if (!this.client) throw new Error('Client sanity check failed!')

        await cron()
    }

    async initEvents() {
        const eventsPath = path.join(__dirname, '..', 'events')
        const eventFiles = fs.readdirSync(eventsPath)

        for (const file of eventFiles) {
            const { event } = await import(path.join(eventsPath, file))
            try {
                if (event.once) {
                    this.client.once(event.name, (...args) => event.run(this, ...args))
                } else {
                    this.client.on(event.name, (...args) => event.run(this, ...args))
                }
            } catch (err) {
                //logger.error(`An error occured while loading event ${event.name}`)
                //logger.error(err)
            }
            //logger.info(`Loaded event ${event.name}`)
        }
    }

    async initCommands() {
        const commandsPath = path.join(__dirname, '..', 'commands')
        const categories = await getCommandCategories(commandsPath)

        for (const category of categories) {
            for (const command of category.commands) {
                if (!command.data) continue // skip loading command if it doesn't exist
                this.commands.set(command.data.name, command)
            }
        }
    }
}

const bot = new Bot()
bot.init()

export { bot }