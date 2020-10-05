const { MessageEmbed } = require("discord.js");
const { stripIndents } = require('common-tags')
const { logs_color } = require('../../util/jsons/colors.json')

module.exports = async (client, oldState, newState) => {
  try {
    let newUserChannel = newState.channelID;
    let oldUserChannel = oldState.channelID;
    let userID = newState.id;
    let user = client.users.cache.get(userID);
    let guildID;
    if (!newUserChannel) guildID = oldState.guild.id;
    else guildID = newState.guild.id;

    if (guildID == "323715376519184385" && newUserChannel) {
      if (oldUserChannel === newUserChannel) return;
      else if (newUserChannel == '751422335570935829') {
        user.send(stripIndents`
                Welcome to The Sheep Pen's Live Stream Voice Chat!!

        Please refrain from using **__ANY of the following__** in an offensive manner while in the chat.

        ▶️ Ethnicity -or- Race
        ▶️ Religious Beliefs -or- Practices
        ▶️ Gender -or- Gender Identity
        ▶️ Sexual Orientation -or- Preference
        ▶️ Medical Conditions, Disabilities -or- Age

        By joining this voice chat, you are agreeing to Rules & Conditions stated above.

        ***Moderators reserve the right to enforce punishments based on their observance of your behavior and their own perception of any situation. Unless otherwise contacted by a Moderator or Owner, all decisions are final and should be considered permanent.***
        `)
      }
    } else if (user.bot) return;
    else {
      let didChange = false;
      const embed = new MessageEmbed()
        .setTitle('Voice Status Change')
        .setColor(logs_color)
        .setTimestamp()
        .setFooter('Logs');

      if (!oldUserChannel && newUserChannel) {
        //joined a voice channel
        didChange = true;
        embed.setDescription(`<@${newState.id}> joined the <#${newUserChannel}> voice channel`)
      } else if (!newUserChannel) {
        //left a voice channel
        didChange = true;
        embed.setDescription(`<@${newState.id}> left <#${oldUserChannel}>`)
      } else if (oldUserChannel && newUserChannel && (oldUserChannel != newUserChannel)) {
        //switched voice channels
        didChange = true;
        embed.setDescription(`<@${newState.id}> moved voice channels from <#${oldUserChannel}> to <#${newUserChannel}>`)
      } else if (oldState.serverDeaf && !newState.serverDeaf) {
        //was server deafened (not self)
        didChange = true;
        embed.setDescription(`<@${newState.id}> was server deafened.`)
      } else if (oldState.serverDeaf && !newState.serverDeaf) {
        //was server undeafened (not self)
        didChange = true;
        embed.setDescription(`<@${newState.id}> was server undeafened.`)
      } else if (oldState.serverMute && !newState.serverMute) {
        //was server muted (not self)
        didChange = true;
        embed.setDescription(`<@${newState.id}> was server muted.`)
      } else if (oldState.serverMute && !newState.serverMute) {
        //was server unmuted (not self)
        didChange = true;
        embed.setDescription(`<@${newState.id}> was server unmuted.`)
      } else if (!oldState.streaming && newState.streaming) {
        //started streaming
        didChange = true;
        embed.setDescription(`<@${newState.id}> started screen sharing in <#${newUserChannel}>.`)
      } else if (oldState.streaming && !newState.streaming) {
        //stopped streaming
        didChange = true;
        embed.setDescription(`<@${newState.id}> stopped screen sharing in <#${newUserChannel}>.`)
      }

      if (didChange) {
        let foundGuild = client.guilds.cache.get(guildID);
        let foundChannel = foundGuild.channels.cache.find(channel => channel.name == 'mod-logs💬');
        if (!foundChannel) return;
        else foundChannel.send(embed);
      }
    }
  } catch (e) {
    console.log(`[ERR] ${e.message}`)
  }
};