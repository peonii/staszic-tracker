import logger from '../logger'
import { REST } from '@discordjs/rest'
import { readFiles } from '../utils/filescan'
import path from 'node:path'
import { CommandInteraction, RESTPostAPIApplicationCommandsJSONBody, Routes } from 'discord.js'
import Command from '../types/command'
import dotenv from 'dotenv'

dotenv.config()

const server = '922800899598974988'
const client = '1015171546186264576'

const commands: Array<RESTPostAPIApplicationCommandsJSONBody> = []
const commandFiles = readFiles(path.join(__dirname, '..', 'commands'));


(async () => {
    for (const file of commandFiles) {
        const command: Command = await import(file)
        commands.push(command.data.toJSON())
        logger.info(`Loaded command ${command.data.name}`)
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
