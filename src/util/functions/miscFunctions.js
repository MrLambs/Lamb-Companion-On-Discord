const request = require('request');
const cheerio = require('cheerio');

const get8ballResponse = () => {
    let replies = ["As I see it, yes.", "Ask again later.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "It is certain.", "It is decidedly so.", "Most likely", "My reply is no.", "My sources say no.", "Outlook not so good.", "Outlook good.", "Reply hazy, try again.", "Signs point to yes.", "Very doubtful.", "Without a doubt.", "Yes.", "Yes - definitely.", "You may rely on it."];
    let result = Math.floor(Math.random() * replies.length)

    return replies[result]
};

const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

const trimArray = (arr, maxLen = 10) => {
    if (arr.length > maxLen) {
        const len = arr.length - maxLen;
        arr = arr.slice(0, maxLen);
        arr.push(`${len} more...`);
    }
    return arr;
}

const sdwFetch = (searchQuery) => {
    const url = `https://stardewvalleywiki.com/${searchQuery}`;
    let data = {};
    request(url, (err, res, html) => {
        if (err) {
            console.log(err.message)
        }
        else if (!err && res.statusCode === 200) {
            const $ = cheerio.load(html);
            // description
            let numerator = 0
            let desc = $('.mw-body-content p')[numerator]
            while ($(desc).text().length < 20) desc = $('.mw-body-content p')[numerator++]
            let revisedDesc = $(desc).text()

            // name
            const name = $('.mw-body h1')[0]
            let revisedName = $(name).text()

            //image
            const image = $('#infoboxtable')
            let tr2 = $(image).find('img')
            let revisedImg = $(tr2).attr('src')

            data.img = `stardewvalleywiki.com${revisedImg}`
            data.name = revisedName
            data.description = revisedDesc.slice(0, revisedDesc.length - 2);
            console.log(data)
            return data
        }
    })
}

export {
    sdwFetch,
    get8ballResponse,
    formatBytes,
    trimArray
}