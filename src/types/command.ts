import { Bot } from "../bot/bot";
import { ApplicationCommandOptionAllowedChannelTypes, ChannelType, ChatInputCommandInteraction, CommandInteraction, PermissionsBitField, SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandChannelOption, SlashCommandStringOption, SlashCommandUserOption } from "discord.js";
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

export function ChannelArgument(name: string, description: string, required: boolean = true, channelTypes: Array<ApplicationCommandOptionAllowedChannelTypes> = []) {
    return function (constructor: Function) {
        constructor.prototype.data.addChannelOption(
            (o: SlashCommandChannelOption) => 
            { 
                const opt = o.setName(name)
                    .setDescription(description)
                    .setRequired(required)
                
                if (channelTypes.length > 0) {
                    opt.addChannelTypes(
                        ...channelTypes
                    )
                }

                return opt
            }
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

export function UserArgument(name: string, decsription: string, required: boolean = true) {
    return function (constructor: Function) {
        constructor.prototype.data.addUserOption(
            (o: SlashCommandUserOption) => {
                const opt = o.setName(name)
                    .setDescription(decsription)
                    .setRequired(required)

                return opt
            }
        )
    }
}

export function NumberArgument(name: string, description: string, required: boolean = true) {
    return function (constructor: Function) {
        constructor.prototype.data.addNumberOption(
            (o: SlashCommandUserOption) => {
                const opt = o.setName(name)
                    .setDescription(description)
                    .setRequired(required)
                
                //TODO: add min/max, choices
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