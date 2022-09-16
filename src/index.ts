import dotenv from 'dotenv'
import { ShardingManager } from 'discord.js'

dotenv.config()

const manager = new ShardingManager('./dist/src/bot/bot.js', {
    token: process.env.BOT_TOKEN
})

manager.on('shardCreate', shard => console.warn('Launched shard ' + shard.id))

manager.spawn()