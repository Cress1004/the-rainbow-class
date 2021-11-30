import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col } from "antd";
import { useParams } from "react-router";
import Axios from "axios";
import { getArrayLength, transformAddressData, transformStudentTypes } from "../../common/transformData";

function ClassDetail(props) {
  const { t } = useTranslation();
  const variable = { useForm: localStorage.getItem("userId") };
  const { id } = useParams();
  const [classData, setClassData] = useState({});

  useEffect(() => {
    Axios.post(`/api/classes/${id}`, { classId: id }).then((response) => {
      if (response.data.success) {
        setClassData(response.data.classData);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, []);

  console.log(classData);

  return (
    <div>
      <div className="class-detail">
        <div className="class-detail__title">{t("class_detail")}</div>
        <Row>
          <Col span={4}>{t("class_name")}</Col>
          <Col span={16}>{classData.class_name}</Col>
        </Row>
        <Row>
          <Col span={4}>{t("description")}</Col>
          <Col span={16}>{classData.description}</Col>
        </Row>
        <Row>
          <Col span={4}>{t("address")}</Col>
          <Col span={16}>{transformAddressData(classData.address)}</Col>
        </Row>
        <Row>
          <Col span={4}>{t("target_student")}</Col>
          <Col span={16}>{transformStudentTypes(classData.student_types)}</Col>
        </Row>
        <Row>
          <Col span={4}>{t("schedule_time")}</Col>
          <Col span={16}>{t("schedule_time")}</Col> {/* them lich hoc */}
        </Row>
        <hr />
        <Row>
          <Col span={12}>{t("number_of_volunteers")}: {getArrayLength(classData.volunteers)}</Col>
          <Col span={12}>{t("number_of_students")}: {getArrayLength(classData.students)}</Col> 
        </Row>
        <Row>
          <Col span={12}>{t("class_monitor")}: {classData.class_monitor}</Col>
          <Col span={12}>{t("sub_class_monitor")}: {classData.sub_class_monitor}</Col> 
        </Row>
      </div>
    </div>
  );
}

export default ClassDetail;
