import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Modal } from "antd";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import Axios from "axios";
import {
  getArrayLength,
  transformAddressData,
  transformDefaultSchedule,
  transformStudentTypes,
} from "../../common/transformData";

function ClassDetail(props) {
  const { t } = useTranslation();
  const history = useHistory();
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
  }, [t, id]);

  const openDeletePopup = () => {
    setConfirmDelete(true);
  };

  const deleteClass = () => {
    setConfirmDelete(false);
    Axios.post(`/api/classes/${id}/delete`, { classId: id }).then(
      (response) => {
        if (response.data.success) {
          alert(t("delete_class_success"));
          history.push("/classes");
        } else {
          alert(t("fail_to_delete_class"));
        }
      }
    );
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <div>
      <div className="class-detail">
        <div className="class-detail__title">{t("class_detail")}</div>
        <Row>
          <Col span={14} />
          <Col span={6}>
            <Button type="primary" className="edit-class-button">
              <Link to={`/classes/${id}/edit`}>{t("edit_class")}</Link>
            </Button>
          </Col>
          <Col span={4}>
            <Button
              type="danger"
              className="delete-class-button"
              onClick={openDeletePopup}
            >
              {t("delete_class")}
            </Button>
          </Col>
        </Row>
        {classData && (
          <>
            <Row>
              <Col span={4} className="label-text">
                {t("class_name")}
              </Col>
              <Col span={16}>{classData.name}</Col>
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
              <Col span={16}>
                {transformStudentTypes(classData.studentTypes)}
              </Col>
            </Row>
            <Row>
              <Col span={4} className="label-text">
                {t("schedule_time")}
              </Col>
              <Col span={16}>
                {classData.defaultSchedule && classData.defaultSchedule.length
                  ? classData.defaultSchedule.map((item) => {
                      const data = transformDefaultSchedule(item);
                      return (
                        <Row>{`${data.dayOfWeek} ${data.startTime} - ${data.endTime}`}</Row>
                      );
                    })
                  : t("not_have_default_schedule")}
              </Col>
            </Row>
            <hr />
            <Row>
              <Col span={12}>
                {t("number_of_volunteers")}:{" "}
                {getArrayLength(classData.volunteers)}
              </Col>
              <Col span={12}>
                {t("number_of_students")}: {getArrayLength(classData.students)}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                {t("class_monitor")}: {classData.classMonitor}
              </Col>
              <Col span={12}>
                {t("sub_class_monitor")}: {classData.subClassMonitor}
              </Col>
            </Row>
          </>
        )}
        <Modal
          title={t("modal_confirm_delete_class_title")}
          visible={confirmDelete}
          onOk={deleteClass}
          onCancel={cancelDelete}
          okText={t("delete_class")}
          cancelText={t("cancel")}
          footer={[
            <Button onClick={cancelDelete}>{t("cancel")}</Button>,
            <Button onClick={deleteClass} type="danger">
              {t("delete_class")}
            </Button>,
          ]}
        >
          {t("modal_confirm_delete_class_content")}
        </Modal>
      </div>
    </div>
  );
}

export default ClassDetail;
