import { ChatInputCommandInteraction } from "discord.js";
import { Bot } from "../../bot/bot";
import { Command, NumberArgument, SlashCommand, UserArgument } from "../../types/command";
import crypto from 'node:crypto'

@NumberArgument('amount', 'The amount to pay')
@UserArgument('recipient', 'The user to pay')
@SlashCommand('pay', 'Pay someone money')
class PayCommand implements Command {
    async run(bot: Bot, interaction: ChatInputCommandInteraction) {
        await interaction.deferReply()
        const amount = interaction.options.getNumber('amount')
        const recipient = interaction.options.getUser('recipient')

        if (amount === null) {
            await interaction.editReply('Invalid amount')
            return
        }

        if (amount <= 0) {
            return interaction.reply('You can\'t send people negative or no money!')
        }

        if (!recipient) return interaction.reply('Couldn\'t get recipient!')

        await bot.prisma.user.upsert({
            where: {
                id: interaction.user.id
            },
            create: {
                id: interaction.user.id
            },
            update: {}
        });

        await bot.prisma.user.upsert({
            where: {
                id: recipient.id
            },
            create: {
                id: recipient.id
            },
            update: {}
        })

        const walletHash = crypto.createHash('sha512').update(interaction.user.id + ':' + recipient.id).digest('base64')
        const walletHashRec = crypto.createHash('sha512').update(recipient.id + ':' + interaction.user.id).digest('base64')

        const userWallet = await bot.prisma.wallet.upsert({
            where: {
                id: walletHash
            },
            create: {
                id: walletHash,
                owner: {
                    connect: {
                        id: interaction.user.id
                    }
                },
                recipient: {
                    connect: {
                        id: recipient.id
                    }
                },
                balance: 0
            },
            update: {}
        })

        await bot.prisma.wallet.update({
            where: { id: walletHash },
            data: { balance: userWallet.balance - ((amount != null) ? amount : 0) }
        })
        
        const recipientWallet = await bot.prisma.wallet.upsert({
            where: {
                id: walletHashRec
            },
            create: {
                id: walletHashRec,
                owner: {
                    connect: {
                        id: recipient.id
                    }
                },
                recipient: {
                    connect: {
                        id: interaction.user.id
                    }
                },
                balance: 0
            },
            update: {}
        })

        await bot.prisma.wallet.update({
            where: { id: walletHashRec },
            data: { balance: recipientWallet.balance + (amount != null ? amount : 0) }
        })

        await interaction.editReply(`Acknowledged payment \`${amount} zł\` from **you** to **${recipient.tag}**.`)

        try {
            await recipient.send(`You just received \`${amount} zł\` from ${interaction.user.tag}!`)
        } catch (err) {
            console.log(err)
        }
    }
}

const instance = new PayCommand()
export { instance }