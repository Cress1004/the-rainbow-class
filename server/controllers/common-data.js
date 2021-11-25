const { Location } = require("../models/Location");

const getLocation = async (req, res) => {
    try {
        const location = await Location.find({});
        res.status(200).json({ success: true, location: location });
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports = { getLocation }