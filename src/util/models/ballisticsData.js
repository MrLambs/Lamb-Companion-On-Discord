const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ballisticSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    penPower: Number,
    dmg: String,
    armorDmgRatio: String,
    projectileSpeed: String,
    fragmentChance: String,
    ricochetChance: String,
    link: String
});

module.exports = mongoose.model('BallisticsData', ballisticSchema)