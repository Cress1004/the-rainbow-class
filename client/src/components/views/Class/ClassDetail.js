import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Modal } from "antd";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import Axios from "axios";
import {
  getArrayLength,
  transformAddressData,
  transformStudentTypes,
} from "../../common/transformData";

function ClassDetail(props) {
  const { t } = useTranslation();
  const variable = { useForm: localStorage.getItem("userId") };
  const { id } = useParams();
  const [classData, setClassData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    Axios.post(`/api/classes/${id}`, { classId: id }).then((response) => {
      if (response.data.success) {
        setClassData(response.data.classData);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, []);

  const openDeletePopup = () => {
    setConfirmDelete(true);
  }

  const deleteClass = () => {
    console.log("abcxyz");
    // can xu ly
  }

  const cancelDelete = () => {
    setConfirmDelete(false)
  }

  return (
    <div>
      <div className="class-detail">
        <div className="class-detail__title">{t("class_detail")}</div>
        <Row>
          <Col span={14} />
          <Col span={6}>
            <Button type="primary" className="edit-class-button">
              <Link to={`/classes/${classData._id}/edit`}>
                {t("edit_class")}
              </Link>
            </Button>
          </Col>
          <Col span={4}>
            <Button type="danger" className="delete-class-button" onClick={openDeletePopup}>
              {t("delete_class")}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={4} className="label-text">
            {t("class_name")}
          </Col>
          <Col span={16}>{classData.class_name}</Col>
        </Row>
        <Row>
          <Col span={4} className="label-text">
            {t("description")}
          </Col>
          <Col span={16}>{classData.description}</Col>
        </Row>
        <Row>
          <Col span={4} className="label-text">
            {t("address")}
          </Col>
          <Col span={16}>{transformAddressData(classData.address)}</Col>
        </Row>
        <Row>
          <Col span={4} className="label-text">
            {t("target_student")}
          </Col>
          <Col span={16}>{transformStudentTypes(classData.student_types)}</Col>
        </Row>
        <Row>
          <Col span={4} className="label-text">
            {t("schedule_time")}
          </Col>
          <Col span={16}>{t("schedule_time")}</Col> {/* them lich hoc */}
        </Row>
        <hr />
        <Row>
          <Col span={12}>
            {t("number_of_volunteers")}: {getArrayLength(classData.volunteers)}
          </Col>
          <Col span={12}>
            {t("number_of_students")}: {getArrayLength(classData.students)}
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            {t("class_monitor")}: {classData.class_monitor}
          </Col>
          <Col span={12}>
            {t("sub_class_monitor")}: {classData.sub_class_monitor}
          </Col>
        </Row>
        <Modal
          title={t("modal_confirm_delete_class_title")}
          visible={confirmDelete}
          onOk={deleteClass}
          onCancel={cancelDelete}
          okText={t("delete_class")}
          cancelText={t("cancel")}
          footer={
            [<Button onClick={cancelDelete}>{t("cancel")}</Button>,
            <Button onClick={deleteClass} type="danger">{t("delete_class")}</Button>]
          }
        >
        {t("modal_confirm_delete_class_content")}
        </Modal>
      </div>
    </div>
  );
}

export default ClassDetail;
