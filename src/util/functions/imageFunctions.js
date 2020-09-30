const { default: fetch } = require('node-fetch');

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
}

export {
    getCatImage,
    getDogImage,
    getFoxImage
}