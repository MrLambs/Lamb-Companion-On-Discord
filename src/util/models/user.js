const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: Schema.Types.ObjectId,
    username: String,
    user_id: String,
    money: {
        type: Number,
        default: 0
    },
    xp: {
        type: Number,
        default: 0
    },
    level: {
        type: Number,
        default: 1
    },
    daily: {
        type: Number,
        default: null
    },
    worked: {
        type: Object,
        default: {
            dailyResetTimeout: null,
            tenMinuteResetTimeout: null,
            workedCounter: 0
        }
    },
    items: {
        type: Object,
        default: {
            ttsCounter: 0
        }
    }
});

module.exports = mongoose.model('User', userSchema)