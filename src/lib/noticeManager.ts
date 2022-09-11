import { NoticeManager, UsersManager } from "librus"
import librusClient from "./librusClient"
import crypto from 'node:crypto'
import { ChannelType, Client, EmbedBuilder, TextChannel } from "discord.js"
import logger from "../utils/logger"
import fs from 'node:fs'
import path from 'node:path'

const knownNotices = new Map<string, string>()

async function fetchNewSchoolNotices(discordClient: Client) {
    logger.info('fetching notices!')
    const failDelayTimeMs = 2 * 60 * 1000
    const noticeManager = new NoticeManager(librusClient)
    const userManager = new UsersManager(librusClient)

    try {
        const schoolNotices = await noticeManager.fetchAll()
        let message = ''
        for (const notice of schoolNotices) {
            const channel = await discordClient.channels.fetch('977522335064158218')
            if (!channel) return logger.info('awawa')
            if (channel.type !== ChannelType.GuildNews) return logger.info('awawa 2')

            if (knownNotices.has(notice.Id)) {
                const contentHash = crypto.createHash('sha512').update(notice.Content).digest('hex')
                const oldContentHash = knownNotices.get(notice.Id)
                if (contentHash !== oldContentHash) {
                    message = 'Aktualizacja ogłoszenia!'
                } else {
                    continue
                } 
            } else {
                message = 'Nowe ogłoszenie!'
            }

            //const author = await userManager.fetch(notice.AddedBy.Id)

            const embed = new EmbedBuilder()
                .setTitle(notice.Subject)
                /*
                .setAuthor({
                    'name': author.FirstName + ' ' + author.LastName
                })
                */
                .setDescription(notice.Content)
            
            const shaHash = crypto.createHash('sha512').update(notice.Content).digest('hex')
            channel.send({ content: message, embeds: [embed] })
            knownNotices.set(notice.Id, shaHash)
        }
    } catch (err) {
        logger.error('uaaaah')
        setTimeout(fetchNewSchoolNotices, failDelayTimeMs, discordClient)
    }

    const knownNoticesRecordType: Record<string, string> = {}
    for (const [key, value] of knownNotices) {
        knownNoticesRecordType[key] = value
    }

    const maxDelayTime = 10 * 60
	const minDelayTime = 8 * 60
    fs.writeFileSync(path.join(__dirname, '..', 'data', 'knownNotices.json'), JSON.stringify(knownNoticesRecordType))
    setTimeout(fetchNewSchoolNotices, ((Math.round(Math.random() * (maxDelayTime - minDelayTime) + minDelayTime)) * 1000), discordClient)
}

async function initLibrus(discordClient: Client) {
    const knownNoticesJSON: Record<string, string> = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'knownNotices.json'), "utf-8"))
    for (const [key, value] of Object.entries(knownNoticesJSON)) {
        knownNotices.set(key, value)
    }
    fetchNewSchoolNotices(discordClient)
}

export { fetchNewSchoolNotices, initLibrus }