const { getEmoji } = require('./chatFunctions');

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


export {
    addWinnings,
    deductBet,
    verifyBetAmount,
    getRouletteResult,
    getCoinFlipResult
}