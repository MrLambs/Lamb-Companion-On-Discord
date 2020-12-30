const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mapSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    description: String,
    keys: Array,
    image: String,
    features: String
});

module.exports = mongoose.model('MapData', mapSchema)