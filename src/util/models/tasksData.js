const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    type: String,
    objs: Array,
    rewards: String,
    givenBy: String,
    link: String
});

module.exports = mongoose.model('TasksData', taskSchema)