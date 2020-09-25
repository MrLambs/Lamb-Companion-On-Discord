const getNeededXP = level => {
    return level * level * 100;
};

const capitalize = str => {
    return str.slice(0, 1).toUpperCase() + str.slice(1);
};

export {
    getNeededXP,
    capitalize
}