const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

const commands = []
commandFiles.forEach(file => {
    const command = require(path.join(commandsPath, file))
    commands.push({ command: command.command, description: command.description })
    bot.command(command.command, command.handler)
})

bot.telegram.setMyCommands(commands)

bot.on(message('sticker'), (ctx) => ctx.reply('👍'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
