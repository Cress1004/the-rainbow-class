import React from "react";
import { useTranslation } from "react-i18next";
import "./dashboard.scss";

function Dashboard(props) {
  const { t } = useTranslation();
  
  return (
    <div className="dashboard">
      <div className="dashboard__title">{t("my_schedule")}</div>
    </div>
  );
}

export default Dashboard;
