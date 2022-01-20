import Axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function useFetchRole(userId) {
  const [userRole, setUserRole] = useState({});
  const [userClassId, setUserClassId] = useState({});

  const { t } = useTranslation();
  useEffect(() => {
    Axios.post(`/api/users/get-role`, { userId: userId }).then((response) => {
      if (response.data.success) {
        setUserRole(response.data.userRole);
        setUserRole((userRole) => {
          return userRole;
        });
        setUserClassId(response.data.classId);
        setUserClassId((classId) => {
          return classId;
        });
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t, userId]);
  return {userRole, userClassId};
}