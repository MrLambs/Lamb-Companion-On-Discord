module.exports = (bot) => {
    let prompt = process.openStdin()
    prompt.addListener('data', res => {
        let x = res.toString().trim().split(/ +/g)
        bot.channels.get('629880327833387028').send(x.join(" "));
    });
};