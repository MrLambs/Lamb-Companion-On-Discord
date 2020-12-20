const { getEmoji, titleCase } = require('./chatFunctions');
const gTTS = require('gtts');
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
            card1: Math.floor(Math.random() * 11) + 1,
            card2: Math.floor(Math.random() * 11) + 1
        },
        botHand: {
            card1: Math.floor(Math.random() * 11) + 1,
            card2: Math.floor(Math.random() * 11) + 1
        }
    }
}

const getRandomCardSuit = () => {
    let cardSuits = ['hearts', 'spades', 'diamonds', 'clubs'];

    return cardSuits[Math.floor(Math.random() * cardSuits.length)]
}

const filterCardArrays = (playerArray, botArray, tenValues) => {
    let newPlayArr = playerArray,
        newBotArr = botArray,
        botValueArr = [],
        playValueArr = [],
        valueArrays,
        filterArrays

    for (let i = 0; i < newPlayArr.length; i++) {
        playValueArr.push(newPlayArr[i]);
        botValueArr.push(newBotArr[i]);

        if (newPlayArr[i] == 1 || newPlayArr[i] == 11) {
            newPlayArr.splice(i, 1, 'A')
        } else if (newPlayArr[i] == 10) {
            newPlayArr.splice(i, 1, tenValues[Math.floor(Math.random() * tenValues.length)])
        }
        
        if (newBotArr[i] == 1 || newBotArr[i] == 11) {
            newBotArr.splice(i, 1, 'A')
        } else if (newBotArr[i] == 10) {
            newBotArr.splice(i, 1, tenValues[Math.floor(Math.random() * tenValues.length)])
        }

        newPlayArr.splice(i, 1, `**${newPlayArr[i]}**` + ` of **${titleCase(getRandomCardSuit())}**`)
        newBotArr.splice(i, 1, `**${newBotArr[i]}**` + ` of **${titleCase(getRandomCardSuit())}**`)
    }

    return {
        valueArrays: {
            botValueArr,
            playValueArr
        },
        filterArrays: {
            newPlayArr,
            newBotArr
        }
    }
}

    const finishBlackJackGame = (msg, embed, hit, stand) => {
        msg.edit(embed)
        hit.stop()
        stand.stop();
        msg.reactions.removeAll().catch(err => console.log(`[ERR] ${err.message}`))
    }

    const tts = (voiceChannel, text, user) => {
        if (!fs.existsSync('./src/util/tts')) fs.mkdirSync('./src/util/tts');
        const timestamp = new Date().getTime();
        const soundPath = `./src/util/tts/${timestamp}.mp3` //${timestamp}.mp3

        let gtts = new gTTS(text, 'en');
        gtts.save(soundPath, (err, res) => {
            if (err) return console.log(`[ERR] ${err.message}`)
            else {
                voiceChannel.join()
                    .then(connection => {
                        connection
                            .play(soundPath)
                            .on('finish', () => {
                                connection.disconnect()
                                fs.unlinkSync(soundPath);
                                let current = user.items.ttsCounter;
                                user.items = {
                                    ...user.items,
                                    ttsCounter: current + 1
                                }
                                user.money = user.money - 500;
                                user.save()
                            })
                            .on('error', (err) => {
                                console.error(err)
                                connection.disconnect()
                                fs.unlinkSync(soundPath)
                            });
                    }).catch(err => {
                        console.error(err)
                    })
            }
        })
    }

    export {
        addWinnings,
        deductBet,
        verifyBetAmount,
        getRouletteResult,
        getCoinFlipResult,
        getBlackJackGame,
        finishBlackJackGame,
        tts,
        filterCardArrays,
        getRandomCardSuit
    }