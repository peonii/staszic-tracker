import { Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export default interface Command {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    run(client: Client, interaction: CommandInteraction): Promise<void>
}