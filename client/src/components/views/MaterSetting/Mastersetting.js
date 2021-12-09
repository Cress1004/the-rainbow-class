import React from "react";
import { useTranslation } from "react-i18next";
import "./master-setting.scss";
import StudentType from "./SubSetting/StudentType.js/StudentType";

function Mastersetting(props) {
    const { t } = useTranslation();
  return (
    <div className="mastersetting">
      <div className="mastersetting__title">
        {t("master_setting")}
      </div>
        <StudentType />
    </div>
  );
}

export default Mastersetting;
