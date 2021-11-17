import React from "react";
import "./dashboard.scss"

function Dashboard(props) {
  const t = (string) => {
    return string;
  };
  return (
    <div className="dashboard">
      <div className="dashboard__title">{t("my_schedule")}</div>
    </div>
  );
}

export default Dashboard;
