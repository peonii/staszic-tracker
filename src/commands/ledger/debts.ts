import { ChatInputCommandInteraction } from "discord.js";
import { Bot } from "../../bot/bot";
import { Command, SlashCommand } from "../../types/command";

@SlashCommand('debts', 'Check your debts')
class DebtsCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        await interaction.reply('**Debts:**\n...\n\n**Credit:**\n...')
        const user = bot.prisma.user.upsert({
            where: {
                id: interaction.user.id
            },
            update: {},
            create: {
                id: interaction.user.id
            }
        })

        let message = ''

        message += '**Debts:**'
        let debts = 0
        for (const wallet of await user.walletsOwned()) {
            if (wallet.balance < 0) continue
            const recipient = await bot.client.users.fetch(wallet.recipientId)
            if (!recipient) continue
            message += `\n${recipient.tag} -> \`${wallet.balance} zł\``
            debts++
        }
        if (debts === 0) message += '\n*None*'

        message += '\n\n**Credit:**'
        await interaction.editReply(message + '\n...')
        let credit = 0
        for (const wallet of await user.walletsOwned()) {
            if (wallet.balance >= 0) continue
            const recipient = await bot.client.users.fetch(wallet.recipientId)
            if (!recipient) continue
            message += `\n${recipient.tag} -> \`${wallet.balance * -1} zł\``
            credit++
        }
        if (credit === 0) message += '\n*None*'

        await interaction.editReply(message)
    }
}

const instance = new DebtsCommand()
export { instance }