const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fleaSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    item_id: String,
    bsg_id: String,
    shortName: String,
    price: Number,
    avg24hPrice: Number,
    avg7daysPrice: Number,
    traderName: String,
    traderPrice: Number,
    traderPriceCur: String,
    slots: String,
    pricePerSlot: String,
    link: String,
    wikiLink: String,
    image: String,
    imageBig: String,
    updated: String
});

module.exports = mongoose.model('FleaData', fleaSchema)