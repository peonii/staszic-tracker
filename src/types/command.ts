import { Bot } from "../bot/bot";
import {
    ApplicationCommandOptionAllowedChannelTypes,
    ChatInputCommandInteraction,
    SlashCommandBooleanOption,
    SlashCommandBuilder,
    SlashCommandChannelOption,
    SlashCommandNumberOption,
    SlashCommandStringOption,
    SlashCommandUserOption
} from "discord.js";


export function SlashCommand(name: string, description: string) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (constructor: Function) {
        constructor.prototype.data = new SlashCommandBuilder()
        constructor.prototype.data.setName(name)
        constructor.prototype.data.setDescription(description)
    }
}

export function BooleanArgument(name: string, description: string, required = true) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (constructor: Function) {
        constructor.prototype.data.addBooleanOption(
            (o: SlashCommandBooleanOption) => 
            o.setName(name)
                .setDescription(description)
                .setRequired(required)
        )
    }
}

export function ChannelArgument(name: string, description: string, required = true, channelTypes: Array<ApplicationCommandOptionAllowedChannelTypes> = []) {
    // eslint-disable-next-line @typescript-eslint/ban-types
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

export function StringArgument(name: string, description: string, required = true, options: Array<NameValuePairOption> = []) {
    // eslint-disable-next-line @typescript-eslint/ban-types
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

export function UserArgument(name: string, decsription: string, required = true) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (constructor: Function) {
        constructor.prototype.data.addUserOption(
            (o: SlashCommandUserOption) =>
                o.setName(name)
                    .setDescription(decsription)
                    .setRequired(required)
        )
    }
}

export function NumberArgument(name: string, description: string, required = true) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (constructor: Function) {
        constructor.prototype.data.addNumberOption(
            (o: SlashCommandNumberOption) =>
                o.setName(name)
                    .setDescription(description)
                    .setRequired(required)
        )
    }
}

export function RequirePermissions(perms: string | number | bigint) {
    // eslint-disable-next-line @typescript-eslint/ban-types
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