const { Address } = require("../models/Address");
const { Location } = require("../models/Location");
const { StudentType } = require("../models/StudentType");

const findAllLocation = () => {
    return Location.find({});
}

const storeAddress = (data) => {
    const newAddress = new Address(data);
    newAddress.save();
    return newAddress;
}

const findAllStudentTypes = () => {
    return StudentType.find({});
}

const getStudentTypeById = (id) => {
    return StudentType.findOne({_id: id});
}

const storeStudentType = (data) => {
    const studentType = new StudentType(data);
    return studentType.save();
}

module.exports = { findAllLocation, findAllStudentTypes, getStudentTypeById, storeStudentType, storeAddress }