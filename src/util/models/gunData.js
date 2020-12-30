const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gunSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    description: String,
    weight: String,
    soldBy: String,
    caliber: String,
    rateOfFire: String,
    image: String
});

module.exports = mongoose.model('GunData', gunSchema)