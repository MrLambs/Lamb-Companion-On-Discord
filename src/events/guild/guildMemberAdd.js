const { MessageEmbed, Collection } = require('discord.js');
const { green } = require('../../util/jsons/colors.json')

module.exports = async (bot, member) => {
    console.log('yep')
    const newUsers = []

    let messageToSend = [`**${member.user.username}** just joined the server - glhf!`, `**${member.user.username}** just joined. Everyone, look busy!`, `**${member.user.username}** joined your party.`, `**${member.user.username}** joined. You must construct additional pylons`, `Ermagherd. **${member.user.username}** is here.`, `Welcome, **${member.user.username}**. Stay awhile and listen.`, `Welcome, **${member.user.username}**. We were expecting you ( ͡° ͜ʖ ͡°)`, `Welcome, **${member.user.username}**. We hope you brought pizza.`, `Welcome, **${member.user.username}**. Leave your weapons by the door.`, `A wild **${member.user.username}** appeared.`, `Swoooosh. **${member.user.username}** just landed.`, `Brace yourselves. **${member.user.username}** just joined the server.`, `**${member.user.username}** just joined. Hide your bananas.`, `**${member.user.username}** just arrived. Seems OP - please nerf.`, `**${member.user.username}** just slid into the server`, `**${member.user.username}** has spawned in the server.`, `**${member.user.username}** showed up!`, `Where's **${member.user.username}**? In the server!`, `**${member.user.username}** hopped into the server. Kangaroo!!`, `**${member.user.username}** just showed up. Hold my beer.`, `Challenger approaching - **${member.user.username}** has appeared!`];

    let addEmbed = new MessageEmbed()
        .setDescription(messageToSend[Math.floor(Math.random() * messageToSend.length)])
        .setColor(green);

    const guild = member.guild;
    if (!newUsers[guild.id]) newUsers[guild.id] = new Collection();
    newUsers[guild.id].set(member.id, member.user);

    if (newUsers[guild.id].size > 0) {
        guild.channels.cache.find(channel => channel.name == '🚪join_leave' || channel.name == '💠welcome💠').send(addEmbed);
    }
    if (guild.id == '688514030117453895') {
        let students = guild.roles.cache.get('709827205626069062') //Students
        member.roles.add(students)
    };
};