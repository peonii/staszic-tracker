import { Bot } from "../../bot/bot";
import { ChatInputCommandInteraction } from "discord.js";
import { Command, SlashCommand } from "../../types/command";

@SlashCommand('test', 'Test command')
class TestCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        return interaction.reply('Test command from shard ' + bot.client.shard?.ids.join(', '))
    }
}

const instance = new TestCommand()
export { instance }