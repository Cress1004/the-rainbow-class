const {
  findAllClasses,
  tranformClassData,
  storeClass,
} = require("../repository/classRepository");

const getClasses = async (req, res) => {
  try {
    const classes = await findAllClasses();
    Promise.all(classes.map((item) => tranformClassData(item))).then(
      (value) => {
        res.status(200).json({ success: true, classes: value });
      }
    );
  } catch (error) {
    res.status(400).send(error);
  }
};

const addClass = async (req, res) => {
  try {
    storeClass(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = { addClass, getClasses };
