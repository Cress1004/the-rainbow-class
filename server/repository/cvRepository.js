const { CV } = require("../models/CV");

const storeCV  = async (data) => {
    try {
        const newCV = await new CV(data);
        return newCV.save();
    } catch (error) {
        console.log("Fail to store CV");
        return null;
    }
}

module.exports = {
    storeCV
};
