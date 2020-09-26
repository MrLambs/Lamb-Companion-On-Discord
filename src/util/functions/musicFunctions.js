const msToTime = duration => {
    var seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    if (hours > 0) return hours + ":" + minutes + ":" + seconds
    else return minutes + ":" + seconds
}

const createMusicPlayer = (bot, message) => {
    const player = bot.manager.create({
        guild: message.guild.id,
        voiceChannel: message.member.voice.channel.id,
        textChannel: message.channel.id,
    });

    return player;
}

const getGuildPlayer = (bot, message) => {
    const player = bot.manager.players.get(message.guild.id);

    return player;
}

export {
    msToTime,
    createMusicPlayer,
    getGuildPlayer
}