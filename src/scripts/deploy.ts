import logger from '../utils/logger'
import { REST } from '@discordjs/rest'
import { getCommandCategories } from '../utils/filescan'
import path from 'node:path'
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const server = '922800899598974988'
const client = '1015171546186264576'

const commands: Array<RESTPostAPIApplicationCommandsJSONBody> = [];

(async () => {
    const categories = await getCommandCategories(path.join(__dirname, '..', 'commands'))

    for (const category of categories) {
        for (const command of category.commands) {
            commands.push(command.data.toJSON())
            logger.info(`Loaded command ${command.data.name}`)
        }
    }

    if (!process.env.BOT_TOKEN) {
        logger.error('BOT_TOKEN is not set')
        process.exit(1)
    }

    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN)

    try {
            logger.info('Registering commands...')

            const data: any = await rest.put(
                Routes.applicationGuildCommands(client, server),
                { body: commands }
            )

            logger.info(`Registered ${data.length} commands`)
        } catch (err) {
            logger.error(err)
        }
})()
