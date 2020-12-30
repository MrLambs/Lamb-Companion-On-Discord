const mongoose = require('mongoose');
const FleaData = require('../../util/models/fleaData');
const axios = require('axios');
const { tarkov_market_api_key } = require('../jsons/config.json')

function fleaScrape() {
    try {
        axios.get(`https://tarkov-market.com/api/v1/items/all?x-api-key=${tarkov_market_api_key}`)
            .then(res => {
                res.data.forEach(i => {
                    FleaData.findOne({ item_id: i.uid })
                        .then(item => {
                            if (!item) {
                                let newItem = new FleaData({
                                    _id: mongoose.Types.ObjectId(),
                                    name: i.name,
                                    item_id: i.uid,
                                    bsg_id: i.bsgId,
                                    shortName: i.shortName,
                                    price: i.price,
                                    avg24hPrice: i.avg24hPrice,
                                    avg7daysPrice: i.avg7daysPrice,
                                    traderName: i.traderName,
                                    traderPrice: i.traderPrice,
                                    traderPriceCur: i.traderPriceCur,
                                    slots: i.slots,
                                    pricePerSlot: (i.avg24hPrice / i.slots).toFixed(),
                                    link: i.link,
                                    image: i.img,
                                    imageBig: i.imgBig,
                                    updated: i.updated
                                })
                                newItem.save().catch(err => console.log(`[ERR] ${err.message}`))
                                console.log('[LOGS] New flea market item added to database')
                            } else if (item.updated !== i.updated) {
                                item.name = i.name;
                                item.shortName = i.shortName;
                                item.item_id = i.uid;
                                item.bsg_id = i.bsgId;
                                item.price = i.price;
                                item.avg24hPrice = i.avg24hPrice;
                                item.avg7daysPrice = i.avg7daysPrice;
                                item.traderName = i.traderName;
                                item.traderPrice = i.traderPrice;
                                item.traderPriceCur = i.traderPriceCur;
                                item.slots = i.slots;
                                item.pricePerSlot = (i.avg24hPrice / i.slots).toFixed()
                                item.link = i.link;
                                item.wikiLink = i.wikiLink;
                                item.image = i.img;
                                item.imageBig = i.imgBig;
                                item.updated = i.updated;
                                item.save().catch(err => console.log(`[ERR] ${err.message}`))
                                console.log('[LOGS] Flea market item updated in database')
                            }
                        })
                })
            })
    } catch (err) {
        console.log(`[ERR] ${err.message}`)
    }
}

const tarkovScrape = async () => {
    await console.log('[LOGS] Flea market scrape initialized')
    await fleaScrape();
    await console.log('[LOGS] Flea market scrape successful');
    setInterval(async () => {
        await console.log('[LOGS] Checking scrape for updates...')
        await fleaScrape()
        await console.log('[LOGS] Flea market scrape successful');
    }, 3600000);
}

export {
    tarkovScrape
}
