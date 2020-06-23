// Run dotenv
require('dotenv').config();

var prefix = '.'

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {


    //Check if the message is a command, and if the message is not from the bot.
    if(!message.content.startsWith(prefix) || message.author.bot) return;


    //Args contains the message, minus the prefix.
    const args = message.content.slice(prefix.length).split(/ +/);

    //CommanName contains only the name of the Command
    //".help maint ling absorbing me" would be "help"
	const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    try {
        client.commands.get(commandName).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command! Please contact Cimika#7435 about it.');
    }
    
  });
  
client.login(process.env.DISCORD_TOKEN);