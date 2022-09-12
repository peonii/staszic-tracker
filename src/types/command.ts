import { Bot } from "../bot/bot";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export class Command {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    constructor() {
        this.data = new SlashCommandBuilder()
        this.init()
    }

    /**
     * Main run method for this command class.
     * 
     * @param {Bot} bot
     * @param {CommandInteraction} interaction
     * @async
     */
    async run(bot: Bot, interaction: CommandInteraction): Promise<any> {
        interaction.reply('It\'s working!')
    }

    async init() {
        this.data = new SlashCommandBuilder()
    }
}

export interface CommandCategoryMeta {
    name: string
    description: string
}

export interface CommandCategory {
    meta: CommandCategoryMeta
    commands: Command[]
}