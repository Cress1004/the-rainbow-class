const compareObjectId = (id1, id2) => {
    return id1.toString() === id2.toString();
}

const randomUnixSuffix = () => {
    return Date.now() + "-" + Math.round(Math.random() * 1e9);
  };

module.exports = {
    compareObjectId,
    randomUnixSuffix
}