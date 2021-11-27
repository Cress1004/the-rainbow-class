import React from "react";
import { useTranslation } from "react-i18next";
import TypeOfStudent from "./SubSetting/TypeOfStudent/TypeOfStudent";

function Mastersetting(props) {
    const { t } = useTranslation();
  return (
    <div className="mastersetting">
      <div className="mastersetting__title">
        {t("mastersetting")}
      </div>
        <TypeOfStudent />
    </div>
  );
}

export default Mastersetting;
