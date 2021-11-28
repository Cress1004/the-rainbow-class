const { ClassName } = require("../models/ClassName");

const addClass = async (req, res) => {
    try {
        const className = await new ClassName(req.body);
        className.save();
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = { addClass }