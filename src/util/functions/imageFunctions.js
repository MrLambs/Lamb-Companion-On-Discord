const { default: fetch } = require('node-fetch');
const { giphy_token } = require('../jsons/config.json');
const giphy = require('giphy-api')(giphy_token);

const getCatImage = async () => {
    const response = fetch("http://aws.random.cat/meow").then(res => res.json())
    return response;
};

const getDogImage = async () => {
    const response = fetch("http://dog.ceo/api/breeds/image/random").then(res => res.json());
    return response; 
};

const getFoxImage = async () => {
    const response = fetch("https://randomfox.ca/floof/?ref=apilist.fun").then(res => res.json())
    return response;
};

const getShibeImage = async () => {
    const response = fetch("http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true").then(res => res.json())
    return response;
};

const getGiphy = async (search) => {
    const response = giphy.search(search);
    return response;
};

export {
    getCatImage,
    getDogImage,
    getFoxImage,
    getShibeImage,
    getGiphy,
}