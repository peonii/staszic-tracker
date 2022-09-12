import { Bot } from "../bot/bot";
import { ChatInputCommandInteraction, CommandInteraction, PermissionsBitField, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption } from "discord.js";
import { OperationCanceledException, Type } from "typescript";


export function SlashCommand(name: string, description: string) {
    return function (constructor: Function) {
        constructor.prototype.data = new SlashCommandBuilder()
        constructor.prototype.data.setName(name)
        constructor.prototype.data.setDescription(description)
    }
}

export function BooleanArgument(name: string, description: string, required: boolean = true) {
    return function (constructor: Function) {
        constructor.prototype.data.addBooleanOption(
            (o: SlashCommandBooleanOption) => 
            o.setName(name)
                .setDescription(description)
                .setRequired(required)
        )
    }
}

export function ChannelArgument(name: string, description: string, required: boolean = true) {
    return function (constructor: Function) {
        constructor.prototype.data.ddChannelOption(
            (o: SlashCommandChannelOption) => 
            o.setName(name)
                .setDescription(description)
                .setRequired(required)
        )
    }
}

export function StringArgument(name: string, description: string, required: boolean = true, options: Array<NameValuePairOption> = []) {
    return function (constructor: Function) {
        constructor.prototype.data.addStringOption(
            (o: SlashCommandStringOption) => 
            { 
                const opt = o.setName(name)
                    .setDescription(description)
                    .setRequired(required)
                
                if (options.length > 0) {
                    opt.addChoices(
                        ...options
                    )
                }

                return opt
            }
        )
    }
}

export function RequirePermissions(perms: string | number | bigint) {
    return function (constructor: Function) {
        constructor.prototype.data.setDefaultMemberPermissions(perms)
    }
}

export interface Command {
    data?: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandOption">
    run: (bot: Bot, interaction: ChatInputCommandInteraction) => Promise<any>
}
export interface NameValuePairOption {
    name: string
    value: string
}

export interface CommandCategoryMeta {
    name: string
    description: string
}

export interface CommandCategory {
    meta: CommandCategoryMeta
    commands: Command[]
}