const quiz = require('../jsons/quiz.json')
const { EventEmitter } = require('events');
const User = require('../models/user');
const { getEmoji } = require('../functions/chatFunctions')

const random = arr => arr[Math.floor(Math.random() * arr.length)];


class Quiz {
    constructor(message, options = {}, bot) {
        if (!message) throw new Error('[GameCord] >> missing message param')

        this.event = new EventEmitter();

        this.message = message

        this.item = null

        this.filter = null

        this.embed = null

        this.correct = null

        this.options = {
            title: 'Quiz',
            color: 'RANDOM',
            time: 30000,
            timestamp: false,
            ...options
        }
    }

    reset() {
        this.filter = null
        this.item = null
        this.embed = null
        this.correct = null
    }

    run() {
        this.reset()
        this.event.emit('ready', this);
        this.item = random(quiz)
        this.filter = response => {
            return this.item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
        }
        this.event.emit('start', this);
        this.embed = {
            title: this.options.title,
            color: this.options.color,
            description: this.item.question,
            timestamp: this.options.timestamp ? Date.now() : null,
            footer: {
                text: 'Type your guess below!'
            }
        }

        this.message.channel.send({ embed: this.embed }).then(() => {
            this.event.emit('response', this);
            this.message.channel.awaitMessages(this.filter, { max: 1, time: this.options.time, errors: ['time'] })
                .then(collected => {
                    this.correct = true;
                    this.end(collected)
                })
                .catch(collected => {
                    this.correct = false;
                    this.end(collected)
                })
        })
    }

    end(collected) {
        try {
            let first;
            if (this.correct) {
                first = collected.entries().next().value;
                first = first[1].author
            }

            let answers = this.item.answers;
            let firstAnswer = answers.shift();
            let xpAmount = 30;
            console.log(first.id)
            // if (this.correct) {
            //     User.findOne({ user_id: first.id })
            //         .then(user => {
            //             console.log(user.xp)
            //             user.xp += xpAmount;
            //             user.save();
            //             console.log(user.xp)
            //         })
            // }

            this.event.emit('end', this);
            this.embed = {
                title: `${this.correct ? `${first.username} was first to get it right!` : `Nobody got it right`}`,
                color: `${this.correct ? 'GREEN' : 'RED'}`,
                description: `**${this.correct ? `✅ Got the correct answer!` : `❌ Looks like nobody got the answer this time.`}**\n\n**The answer is ${firstAnswer}**.\nOther answers accepted: ${answers.length >= 1 ? answers.join(', ') : 'None'}`,
                timestamp: this.options.timestamp ? Date.now() : null,
            }
            this.message.channel.send({ embed: this.embed })
            this.reset()
        } catch (err) {
            console.log(`[ERR] ${err.message}`)
        }
    }

    on(event, callback) {
        this.event.on(event, callback);
        return this;
    };

    setTitle(title) {
        this.options.title = title;
        return this;
    };

    setColor(color) {
        this.options.color = color;
        return this;
    };

    setTime(time) {
        this.options.time = time;
        return this;
    };

    setTimestamp() {
        this.options.timestamp = true
        return this
    }

}

module.exports = Quiz