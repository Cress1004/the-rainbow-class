const { Location } = require("../models/Location");
const { StudentType } = require("../models/StudentType");

const getLocation = async (req, res) => {
    try {
        const location = await Location.find({});
        res.status(200).json({ success: true, location: location });
    } catch (error) {
        res.status(400).send(error);
    }
};

const getStudentType = async (req, res) => {
    try {
        const studentTypes = await StudentType.find({});
        res.status(200).json({ success: true, studentTypes: studentTypes });
    } catch (error) {
        res.status(400).send(error);
    }
}

const addStudentType = async (req, res) => {
    try {
        const studentType = await new StudentType(req.body);
        studentType.save();
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = { getLocation, getStudentType, addStudentType }