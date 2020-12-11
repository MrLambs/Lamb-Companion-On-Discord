const { getEmoji } = require('./chatFunctions');
const gTTS = require('gtts');
const googleTTS = require('node-google-tts-api')
const fs = require('fs');

const addWinnings = (user, amount) => {
    try {
        user.money = user.money + amount;
        user.save()
    } catch (err) {
        console.log(`[ERR] ${err.message}`)
    };
};

const deductBet = (user, amount) => {
    try {
        user.money = user.money - amount;
        user.save()
    } catch (err) {
        console.log(`[ERR] ${err.message}`)
    };
};

const verifyBetAmount = (user, amount) => {
    let verified = false;
    if (amount <= user.money) return verified = true;
    else return verified
};

const getRouletteResult = (bot, playerChoice) => {
    let redCircle = getEmoji(bot, '727209313960984626'),
        blackCircle = getEmoji(bot, '727209571038396537'),
        colorsArr = [blackCircle, redCircle],
        notEmojiColorsArr = ['black', 'red'],
        count = Math.floor(Math.random() * 25),
        lastColor = '',
        newMessage = '';

    for (let i = 0; i < count; i++) {
        if (i == 0) {
            newMessage = colorsArr[i % colorsArr.length];
            lastColor = notEmojiColorsArr[i % colorsArr.length];
            continue;
        }
        newMessage += colorsArr[i % colorsArr.length];
        lastColor = notEmojiColorsArr[i % colorsArr.length];
    };

    let rouletteGameObj = {
        newMessage: newMessage,
        lastColor: lastColor
    };

    if (playerChoice == lastColor) rouletteGameObj.result = 'won';
    else rouletteGameObj.result = 'lost';

    return rouletteGameObj;
};

const getCoinFlipResult = playerChoice => {
    let gameResult;
    let choices = ['heads', 'tails'],
        tossResult = choices[Math.floor(Math.random() * choices.length)]
    if (tossResult === playerChoice) {
        return gameResult = {
            res: 'won',
            tossResult
        }
    } else {
        return gameResult = {
            res: 'lost',
            tossResult
        }
    }
};

const getBlackJackGame = () => {
    let blackJackGame;
    return blackJackGame = {
        playerHand: {
            card1: Math.floor(Math.random() * 11) + 2,
            card2: Math.floor(Math.random() * 11) + 2
        },
        botHand: {
            card1: Math.floor(Math.random() * 11) + 2,
            card2: Math.floor(Math.random() * 11) + 2
        }
    }
}

const finishBlackJackGame = (msg, embed, hit, stand) => {
    msg.edit(embed)
    hit.stop()
    stand.stop();
}

const tts = (voiceChannel, text, user) => {
    if (!fs.existsSync('./src/util/tts')) fs.mkdirSync('./src/util/tts');
    const timestamp = new Date().getTime();
    const soundPath = `./src/util/tts/${timestamp}.mp3` //${timestamp}.mp3

    const tts = new googleTTS();

    tts.get({
        text: text,
        lang: 'en',
        gender: 'male'
    }).then(data => {
        fs.writeFileSync(soundPath, data)
    })

    // let gtts = new gTTS(text, 'en-ca');
    // gtts.save(soundPath, (err, res) => {
    // if (err) return console.log(`[ERR] ${err.message}`)
    // else {
    //     voiceChannel.join()
    //         .then(connection => {
    //             connection
    //                 .play(soundPath)
    //                 .on('finish', () => {
    //                     connection.disconnect()
    //                     fs.unlinkSync(soundPath);
    //                     let current = user.items.ttsCounter;
    //                     // user.items = {
    //                     //     ...user.items,
    //                     //     ttsCounter: current + 1
    //                     // }
    //                     // user.money = user.money - 500;
    //                     user.save()
    //                 })
    //                 .on('error', (err) => {
    //                     console.error(err)
    //                     connection.disconnect()
    //                     fs.unlinkSync(soundPath)
    //                 });
    //         }).catch(err => {
    //             console.error(err)
    //         })
    // }
    // })
}

export {
    addWinnings,
    deductBet,
    verifyBetAmount,
    getRouletteResult,
    getCoinFlipResult,
    getBlackJackGame,
    finishBlackJackGame,
    tts
}