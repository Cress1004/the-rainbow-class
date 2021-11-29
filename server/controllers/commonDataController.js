const { findAllLocation, findAllStudentTypes, getStudentTypeById, storeStudentType } = require("../repository/commonRepository");
const { StudentType } = require("../models/StudentType");

const getLocation = async (req, res) => {
    try {
        const location = await findAllLocation();
        res.status(200).json({ success: true, location: location });
    } catch (error) {
        res.status(400).send(error);
    }
};

const getStudentTypes = async (req, res) => {
    try {
        const studentTypes = await findAllStudentTypes();
        res.status(200).json({ success: true, studentTypes: studentTypes });
    } catch (error) {
        res.status(400).send(error);
    }
}

const getStudentType = async (id) => {
    try {
        const type = await getStudentTypeById(id);
        return type;
    } catch (error) {
        return null;
    }
}

const addStudentType = async (req, res) => {
    try {
        const studentType = await storeStudentType(req.body);
        studentType.save();
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(400).send(error);
    }
}

module.exports = { getLocation, getStudentTypes, addStudentType, getStudentType }