import dotenv from 'dotenv'
import { ShardingManager } from 'discord.js'
import logger from './utils/logger'

dotenv.config()

const manager = new ShardingManager('./dist/src/bot/bot.js', {
    token: process.env.BOT_TOKEN
})

manager.on('shardCreate', shard => logger.warn('Launched shard ' + shard.id))

manager.spawn()