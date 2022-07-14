const {
  findAllLocation,
  findAllStudentTypes,
  getStudentTypeById,
  storeStudentType,
  removeStudentType,
  getDistrictsByProvinceId,
  getWardsByDistrictId,
  findAllSubjects,
  getSubjectById,
  storeSubject,
  removeSubject,
  findGrades,
  storeGrade,
  removeGrade,
  findSemesters,
  storeSemester,
  removeSemester,
  findStudentTypeWithParams,
  updateStudentType,
} = require("../repository/commonRepository");

const getLocation = async (req, res) => {
  try {
    const location = await findAllLocation();
    res.status(200).json({ success: true, location: location });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getDistricts = async (req, res) => {
  try {
    const provinceId = req.body.provinceId;
    const districts = await getDistrictsByProvinceId(provinceId);
    res.status(200).json({ success: true, districts: districts });
  } catch (error) {
    console.log(error);
  }
};

const getWards = async (req, res) => {
  try {
    const provinceId = req.body.provinceId;
    const districtId = req.body.districtId;
    const wards = await getWardsByDistrictId(provinceId, districtId);
    res.status(200).json({ success: true, wards: wards });
  } catch (error) {
    console.log(error);
  }
};

const getStudentTypes = async (req, res) => {
  try {
    const params = req.query;
    const studentTypes = await findStudentTypeWithParams(params);
    res
      .status(200)
      .json({
        success: true,
        studentTypes: studentTypes.documents,
        count: studentTypes.count,
        message: studentTypes.message,
      });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getStudentType = async (id) => {
  try {
    const type = await getStudentTypeById(id);
    return type;
  } catch (error) {
    return null;
  }
};

const addStudentType = async (req, res) => {
  try {
    const studentType = await storeStudentType(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const editStudentType = async (req, res) => {
  try {
    const result = await updateStudentType(req.body);
    console.log(result)
    res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteStudentType = async (req, res) => {
  try {
    removeStudentType(req.body.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await findAllSubjects();
    res.status(200).json({ success: true, subjects: subjects });
  } catch (error) {
    res.status(400).send(error);
  }
};

const addSubject = async (req, res) => {
  try {
    await storeSubject(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteSubject = async (req, res) => {
  try {
    removeSubject(req.body.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getGrades = async (req, res) => {
  try {
    const grades = await findGrades();
    res.status(200).json({ success: true, grades: grades });
  } catch (error) {
    res.status(400).send(error);
  }
};

const addGrade = async (req, res) => {
  try {
    await storeGrade(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteGrade = async (req, res) => {
  try {
    removeGrade(req.body.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const getSemesters = async (req, res) => {
  try {
    const semesters = await findSemesters();
    res.status(200).json({ success: true, semesters: semesters });
  } catch (error) {
    res.status(400).send(error);
  }
};

const addSemester = async (req, res) => {
  try {
    await storeSemester(req.body);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteSemester = async (req, res) => {
  try {
    removeSemester(req.body.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  getLocation,
  getStudentTypes,
  addStudentType,
  editStudentType,
  getStudentType,
  deleteStudentType,
  getDistricts,
  getWards,
  getSubjects,
  addSubject,
  deleteSubject,
  getGrades,
  addGrade,
  deleteGrade,
  getSemesters,
  addSemester,
  deleteSemester,
};
