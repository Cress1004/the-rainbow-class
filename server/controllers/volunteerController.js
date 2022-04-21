const {
  VOLUNTEER_ROLE,
  STUDENT_ROLE,
  CLASS_MONITOR,
  SUB_CLASS_MONITOR,
} = require("../defaultValues/constant");
const { getStudentByUserId } = require("../repository/studentRepository");
const {
  getUserDataById,
  checkDuplicateMail,
  getUserByVolunteer,
} = require("../repository/userRepository");
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
const { getCurrentUserRole } = require("./userController");

const addNewVolunteer = async (req, res) => {
  try {
    const userId = req.body.userId;
    const volunteerData = req.body.volunteerData;
    const user = await getUserDataById(userId);
    if (user.role === VOLUNTEER_ROLE) {
      const currentVolunteer = await getVolunteerByUserId(userId);
      if (
        currentVolunteer.isAdmin ||
        currentVolunteer.role === CLASS_MONITOR ||
        currentVolunteer.role === SUB_CLASS_MONITOR
      ) {
        if (await checkDuplicateMail(volunteerData.email)) {
          res.status(200).json({ success: false, message: "Duplicate Email!" });
        } else {
          await storeVolunteer(volunteerData);
          await activeAccount(volunteerData.email);
          res.status(200).json({ success: true });
        }
      } else {
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
    const userId = req.user._id;
    const currentUser = await getUserDataById(userId);
    const volunteers = await getListVolunteers(currentUser);
    res.status(200).json({ success: true, volunteers: volunteers });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getVolunteerData = async (req, res) => {
  try {
    const volunteerId = req.params.id;
    const user = req.user;
    const watchingVolunteer = await getVolunteerById(volunteerId);
    const watchingVolunteerUser = await getUserByVolunteer(watchingVolunteer);
    const volunteerRole = await getCurrentUserRole(watchingVolunteerUser);
    var volunteer;
    //TODO: check
    if (user.role === STUDENT_ROLE) {
      const student = await getStudentByUserId(user._id);
      volunteer = await getVolunteerByIdAndClassId(volunteerId, student.class);
    }
    if (user.role === VOLUNTEER_ROLE) {
      const currentVolunteer = await getVolunteerByUserId(user._id);
      if (currentVolunteer.isAdmin) {
        volunteer = watchingVolunteer;
      } else {
        volunteer = await getVolunteerByIdAndClassId(
          volunteerId,
          currentVolunteer.class
        );
      }
    }
    res.status(200).json({
      success: true,
      volunteer: volunteer,
      volunteerRole: volunteerRole,
    });
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
    const volunteerId = req.params.id;
    const user = req.user;
    if (!(await deleteVolunteer(user, volunteerId)))
      res.status(404).json({ success: false, messsage: "Permission Denied" });
    else {
      res.status(200).json({ success: true });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

const getCurrentVolunteer = async (req, res) => {
  try {
    const userId = req.user._id;
    const currentVolunteerData = await getVolunteerByUserId(userId);
    res.status(200).json({ success: true, volunteerData: currentVolunteerData});
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
  getCurrentVolunteer
};
