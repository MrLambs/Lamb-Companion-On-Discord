const {
    MessageEmbed
} = require('discord.js');
const {
    dark_purple
} = require('../../util/jsons/colors.json');
const {
    stripIndents
} = require('common-tags');

module.exports = {
    config: {
        name: "bestammo",
        aliases: ["bestcaliber", "bestforcaliber", "best"],
        usage: `[caliber size]`,
        description: "Returns the best available ammunition type for selected caliber size",
        accessableby: "Members",
        category: "escape_from_tarkov"
    },
    run: async (bot, message, args) => {
        try {
            let noArgs = new MessageEmbed()
                .setColor("RED")
                .setDescription(":x: Please enter a caliber name.")
            if (!args) return message.channel.send(noArgs)
            let search = args[0].toLocaleLowerCase()
            let calibers = ['4.6x30', '.366', '12x70', '20x70', '9x39', '9x21', '9x19', '9x18', '5.7x28', '7.62x39', '7.62x51', '7.62x54', '7.62x25', '5.56x45', '5.45x39', '12.7x55']
            if (calibers.includes(search.toLocaleLowerCase())) {
                let resEmbed = new MessageEmbed()
                    .setColor(dark_purple)
                    .setTitle(`Results for ${search} Ammo Types in Escape from Tarkov`)
                    .setURL('https://odealo.com/articles/escape-from-tarkov-ammo-chart')
                    .setTimestamp()
                    .setFooter(`${bot.user.username}`, bot.user.displayAvatarURL);
                switch (search) {
                    case '4.6x30':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%204.6x30mm%20Graph.jpg')
                        break;
                    case '.366':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%20.366.jpg')
                        break;
                    case '12x70':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%2012x70mm.jpg')
                        break;
                    case '20x70':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%2020x70mm.jpg')
                        break;
                    case '9x39':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%209x39mm.jpg')
                        break;
                    case '9x21':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%209x21mm.jpg')
                        break;
                    case '9x19':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%209x19mm.jpg')
                        break;
                    case '9x18':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%209x18mm.jpg')
                        break;
                    case '5.7x28':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%205.7x28mm.jpg')
                        break;
                    case '5.7x28':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%205.7x28mm.jpg')
                        break;
                    case '7.62x39':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%207.62x39.jpg')
                        break;
                    case '7.62x51':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%207.62x51mm.jpg')
                        break;
                    case '7.62x54':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%207.62x54mmR.jpg')
                        break;
                    case '7.62x25':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%207.62x25mm.jpg')
                        break;
                    case '5.56x45':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%205.56x45mm.jpg')
                        break;
                    case '5.45x39':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%205.45x39mm.jpg')
                        break;
                    case '12.7x55':
                        resEmbed
                            .setImage('https://odealo.com/uploads/public/Escape%20from%20Tarkov/Ammo%20chart/UPDATE/UPDATE%2012.7x55mm_pop.jpg')
                        break;
                }
                return message.channel.send(resEmbed)
            } else {
                let notFoundEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(stripIndents`
                :x: You **must** enter __one__ of the following:

                \`\`\`
                ${calibers.join("\n")}
                \`\`\`
                `)
                return message.channel.send(notFoundEmbed)
            }
        } catch (err) {
            console.log(`[ERR] ${err.message}`)
        }
    }
};