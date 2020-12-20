const { MessageEmbed } = require('discord.js');
const { tts } = require('../../util/functions/casinoFunctions');
const User = require('../../util/models/user');

module.exports = {
    config: {
        name: "buy",
        aliases: ['purchase'],
        usage: ``,
        description: "Purchase an item for the Shepherd's Market",
        accessableby: "Members",
        category: "casino"
    },
    run: async (bot, message, args) => {
        let purchase = args.join(' ').toLowerCase();
        if (!purchase) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(':x: Please provide an item to buy.'))
        User.findOne({ user_id: message.author.id })
            .then(async user => {
                switch (purchase) {
                    case 'house':
                        break;
                    case 'car':
                        break;
                    case 'watch':
                        break;
                    case 'tts message':
                    case 'tts':
                        const voiceChannel = message.member.voice.channel;
                        if (!voiceChannel) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: You cannot buy this item until you are in a voice channel."));
                        const permissions = voiceChannel.permissionsFor(bot.user);
                        if (!permissions.has("CONNECT")) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(":x: I cannot connect to your voice channel, make sure I have permission to!"));
                        else if (user.money < 500) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(':x: You do not have enough money to buy that item.'))                        
                        
                        await message.channel.send(new MessageEmbed().setColor('GREEN').setDescription('Please respond to this message with what you would like said over TTS.').setFooter('Your response time closes in 30 seconds.'))                        
                        const collector = message.channel.createMessageCollector(m => {
                            return m.author.id === message.author.id
                        }, { time: 30000, max: 1 })
                        collector.on('collect', async m => {
                            await tts(voiceChannel, m.content, user)
                            await message.channel.send(new MessageEmbed().setColor('GREEN').setDescription(`:white_check_mark: ${message.author.username}, your purchase has been completed and \`\`500\`\` **Lambies** have been deducted from your account. `))
                        })
                        .on("end", (_, reason) => {
                            if (["time", "cancelled"].includes(reason)) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(":x: Cancelled selection."))
                        });

                        break;
                }
            })
    }
};