import fs from 'node:fs'
import path from 'node:path'
import { Command, CommandCategory, CommandCategoryMeta } from '../types/command'
import cliProgress from 'cli-progress'

const getCommands = async (commandsPath: string): Promise<Command[]> => {
    const commandFiles = fs.readdirSync(commandsPath)
    const commands: Command[] = []
    const progress_bar = new cliProgress.SingleBar({ 
        format: `${commandsPath.split('/').slice(-1)[0]} | {bar} | {percentage}%`
    }, cliProgress.Presets.shades_classic)
    progress_bar.start(commandFiles.length - 1, 0)
    for (const file of commandFiles) {
        if (!(file.endsWith('.ts') || file.endsWith('.js')) || file.startsWith('__')) continue

        const { instance } = await import(path.join(commandsPath, file))
        progress_bar.increment()
        commands.push(instance)
    }
    progress_bar.stop()

    return commands
}

const getCommandCategories = async (dir: string): Promise<CommandCategory[]> => {
    const categories: CommandCategory[] = []
    const files = fs.readdirSync(dir)
    console.log('Loading commands...\n')
    for (const file of files) {
        const categoryMeta = await import(path.join(dir, file, '__meta.js'))
        const category: CommandCategory = {
            meta: categoryMeta.default,
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