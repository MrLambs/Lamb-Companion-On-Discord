const User = require('../models/user');

const addWinnings = (amount, message) => {
    try {
        User.findOne({ user_id: message.author.id })
            .then(user => {
                user.money += (amount * 2);
                user.save()
            })
    } catch (err) {
        console.log(`[ERR] ${err.message}`)
    };
};

const deductBet = (amount, message) => {
    try {
        User.findOne({ user_id: message.author.id })
            .then(user => {
                user.money -= amount;
                user.save()
            })
    } catch (err) {
        console.log(`[ERR] ${err.message}`)
    };
};

const returnBet = (amount, message) => {
    try {
        User.findOne({ user_id: message.author.id })
            .then(user => {
                user.money += amount;
                user.save()
            })
    } catch (err) {
        console.log(`[ERR] ${err.message}`)
    };
};

const verifyBetAmount = (amount, message) => {
    let verified = false;
    return User
        .findOne({ user_id: message.author.id })
        .then(user => {
            if (amount <= user.money) return verified = true;
            else return verified
        })
};

const getRouletteResult = (playerChoice) => {
    let redCircle = '🔴',
    blackCircle = '⚫',
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


export {
    addWinnings,
    deductBet,
    returnBet,
    verifyBetAmount,
    getRouletteResult
}