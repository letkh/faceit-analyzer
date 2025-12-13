const { Telegraf } = require('telegraf')
const fs = require('fs')
const path = require('path')

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

const commandsPath = path.join(__dirname, '..', 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'))

const commands = []
commandFiles.forEach(file => {
    const cmd = require(path.join(commandsPath, file))
    commands.push({ command: cmd.command, description: cmd.description })
    bot.command(cmd.command, cmd.handler)
})

const handlersPath = path.join(__dirname, '..', 'handlers')
const handlerFiles = fs.readdirSync(handlersPath).filter(f => f.endsWith('.js'))

handlerFiles.forEach(file => {
    const handler = require(path.join(handlersPath, file))

    if (handler.filter && typeof handler.filter === 'function') {
        bot.hears(handler.filter, handler.handler)
    } else if (handler.type === 'on') {
        bot.on(handler.filter, handler.handler)
    }
})

bot.telegram.setMyCommands(commands).catch(e => console.warn('setMyCommands failed:', e.message))

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed')
    }

    try {
        await bot.handleUpdate(req.body, res)
        if (!res.headersSent) {
            res.status(200).json({ ok: true })
        }
    } catch (e) {
        console.error('Handler error:', e)
        res.status(500).json({ error: 'Internal Server Error' })
    }
}