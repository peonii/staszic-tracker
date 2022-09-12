import { Bot } from "@/bot/bot";
import { ChatInputCommandInteraction } from "discord.js";
import { Command, SlashCommand } from "../../types/command";

@SlashCommand('test', 'Test command')
class TestCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        interaction.reply('It works!')
    }
}

const instance = new TestCommand()
export { instance }