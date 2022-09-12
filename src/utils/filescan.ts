import fs from 'node:fs'
import path from 'node:path'
import { Command, CommandCategory, CommandCategoryMeta } from '../types/command'

const getCommands = async (commandsPath: string): Promise<Command[]> => {
    const commandFiles = fs.readdirSync(commandsPath)
    const commands: Command[] = []

    for (const file of commandFiles) {
        if (!(file.endsWith('.ts') || file.endsWith('.js'))) continue

        const { instance } = await import(path.join(commandsPath, file))
        commands.push(instance)
    }

    return commands
}

const getCommandCategories = async (dir: string): Promise<CommandCategory[]> => {
    const categories: CommandCategory[] = []
    const files = fs.readdirSync(dir)
    for (const file of files) {
        const categoryMeta: CommandCategoryMeta = await import(path.join(dir, file, '__meta.json'))

        const category: CommandCategory = {
            meta: categoryMeta,
            commands: await getCommands(path.join(dir, file))
        }
        categories.push(category)
    }
    return categories
}

export {
    getCommandCategories,
    getCommands
}