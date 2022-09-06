import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface Command {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    run(client: Client, interaction: CommandInteraction): Promise<void>
}

export interface CommandCategoryMeta {
    name: string
    description: string
}

export interface CommandCategory {
    meta: CommandCategoryMeta
    commands: Command[]
}