import { LibrusClient } from 'librus'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.LIBRUS_USERNAME || !process.env.LIBRUS_PASSWORD) {
    console.error('No LIBRUS_USERNAME or LIBRUS_PASSWORD set!')
    process.exit(1)
}

const client = new LibrusClient();

(async () => {
    await client.login(process.env.LIBRUS_USERNAME || '', process.env.LIBRUS_PASSWORD || '')

    const pushDevice = await client.newPushService()

    console.log('YOUR PUSH DEVICE ID: ' + pushDevice + '\nCopy the above number and set LIBRUS_PUSH_DEVICE to it.')
})()
