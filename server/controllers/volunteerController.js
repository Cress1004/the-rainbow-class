const {
  VOLUNTEER_ROLE,
  STUDENT_ROLE,
  SUPER_ADMIN,
  CLASS_MONITOR,
  SUB_CLASS_MONITOR,
  ADMIN,
} = require("../defaultValues/constant");
const { getStudentByUserId } = require("../repository/studentRepository");
const { getUserDataById, checkDuplicateMail } = require("../repository/userRepository");
const {
  storeVolunteer,
  getListVolunteers,
  getVolunteerById,
  updateVolunteer,
  deleteVolunteer,
  getVolunteerByIdAndClassId,
  getVolunteerByUserId,
} = require("../repository/volunteerRepository");
const { activeAccount } = require("./authController");

const addNewVolunteer = async (req, res) => {
  try {
    const userId = req.body.userId;
    const volunteerData = req.body.volunteerData;
    const user = await getUserDataById(userId);
    if (user.role === VOLUNTEER_ROLE) {
      const currentVolunteer = await getVolunteerByUserId(userId);
      if (
        currentVolunteer.role === ADMIN ||
        currentVolunteer.role === CLASS_MONITOR ||
        currentVolunteer.role === SUB_CLASS_MONITOR
      ) {
        if(await checkDuplicateMail(volunteerData.email)) {
          res.status(200).json({ success: false, message: "Duplicate Email!" });
        } else {
          await storeVolunteer(volunteerData);
          await activeAccount(volunteerData.email);
          res.status(200).json({ success: true });      
        }
      }
      else {
        res.status(200).json({ success: false, message: "Permission Denied" });
      }
    } else {
      res.status(200).json({ success: false, message: "Permission Denied" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const getAllVolunteer = async (req, res) => {
  try {
    const userId = req.body.userId;
    const currentUser = await getUserDataById(userId);
    const volunteers = await getListVolunteers(currentUser);
    res.status(200).json({ success: true, volunteers: volunteers });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getVolunteerData = async (req, res) => {
  try {
    const userId = req.body.userId;
    const volunteerId = req.body.id;
    const user = await getUserDataById(userId);
    var volunteer;
    if (user.role === STUDENT_ROLE) {
      const student = await getStudentByUserId(userId);
      volunteer = await getVolunteerByIdAndClassId(volunteerId, student.class);
    }
    if (user.role === VOLUNTEER_ROLE) {
      const currentVolunteer = await getVolunteerByUserId(userId);
      if (currentVolunteer.role === VOLUNTEER_ROLE) {
        volunteer = await getVolunteerByIdAndClassId(
          volunteerId,
          currentVolunteer.class
        );
      } else if (currentVolunteer.role === SUPER_ADMIN) {
        volunteer = null;
      } else {
        volunteer = await getVolunteerById(req.body.id);
      }
    }
    res.status(200).json({ success: true, volunteer: volunteer });
  } catch (error) {
    res.status(400).send(error);
  }
};

const editVolunteer = async (req, res) => {
  try {
    await updateVolunteer(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteVolunteerData = async (req, res) => {
  try {
    const userId = req.body.userId;
    const volunteerId = req.body.volunteerId;
    const user = await getUserDataById(userId);
    if (!(await deleteVolunteer(user, volunteerId)))
      res.status(404).json({ success: false, messsage: "Permittion Denied" });
    else {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  addNewVolunteer,
  getAllVolunteer,
  getVolunteerData,
  editVolunteer,
  deleteVolunteerData,
};
