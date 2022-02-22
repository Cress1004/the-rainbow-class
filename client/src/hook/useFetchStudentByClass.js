import Axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useFetchStudentByClass(classId) {
  const [studentData, setStudentData] = useState({});
  const { t } = useTranslation();
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    Axios.post(`/api/classes/${classId}/get-students`, {
      classId: classId
    }).then((response) => {
      const res = response.data;
      if (res.success) {
        setStudentData(res.studentData);
        setStudentData((studentData) => {
          return studentData;
        });
      } else if (!res.success) {
        alert(res.message);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t, classId]);
  return studentData;
}
