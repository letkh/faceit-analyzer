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

const handlersPath = path.join(__dirname, 'handlers')
const handlerFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'))

handlerFiles.forEach(file => {
    const handler = require(path.join(handlersPath, file))
    
    if (handler.type === 'on') {
        bot.on(handler.filter, handler.handler)
    } else {
        bot.hears(handler.filter, handler.handler)
    }
})

bot.launch()

