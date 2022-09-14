import { Bot } from "../../bot/bot";
import { ChatInputCommandInteraction } from "discord.js";
import { Command, SlashCommand, UserArgument } from "../../types/command";

@UserArgument('user', 'The user to check')
@SlashCommand('debt', 'Get your debt to someone/someone\'s debt to you')
class DebtCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        const rec = interaction.options.getUser('user')
        await interaction.deferReply()

        if (!rec) return

        const user = bot.prisma.user.upsert({
            where: {
                id: interaction.user.id
            },
            update: {},
            create: {
                id: interaction.user.id
            }
        })

        const wallets = await user.walletsOwned()
        const wallet = wallets.filter(w => w.recipientId === rec.id)

        if (wallet.length === 0) return interaction.editReply('You don\'t have any transaction history with that user (no debt)!')
        else {
            const w = wallet[0]
            if (w.balance < 0) {
                return interaction.editReply(`${rec.tag} owes you \`${w.balance * -1} zł\`!`)
            } else if (w.balance > 0) {
                return interaction.editReply(`You owe ${rec.tag} \`${w.balance} zł\`!`)
            } else {
                return interaction.editReply(`You don't own this person anything, and this person doesn't owe you anything!`)
            }
        }
    }
}

const instance = new DebtCommand()
export { instance }