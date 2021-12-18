import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, Button, Modal } from "antd";
import { transformAddressData } from "../../../../common/transformData";
import Axios from "axios";

const CLASS_MONITOR = 1;
const SUB_CLASS_MONITOR = 2;

function VolunteerDetail(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [volunteerData, setVolunteerData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    Axios.post(`/api/volunteers/${id}`, { id: id }).then((response) => {
      if (response.data.success) {
        const data = response.data.volunteer;
        setVolunteerData({
          id: data._id,
          name: data.user.name,
          email: data.user.email,
          address: transformAddressData(data.address),
          phoneNumber: data.phone_number,
          role: data.role,
          className: data.class_name
        });
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t, id]);

  const openDeletePopup = () => {
    setConfirmDelete(true);
  };

  const deleteClass = () => {
    console.log("abc");
    setConfirmDelete(false);
    //   Axios.post(`/api/classes/${id}/delete`, { classId: id }).then(
    //     (response) => {
    //       if (response.data.success) {
    //         alert(t("delete_class_success"));
    //         history.push("/classes");
    //       } else {
    //         alert(t("fail_to_delete_class"));
    //       }
    //     }
    //   );
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  const transformRoleWithClass = (className, role) => {
    if (role === CLASS_MONITOR) return `${t("class_monitor")} - ${className}`;
    if (role === SUB_CLASS_MONITOR)
      return `${t("sub_class_monitor")} - ${className}`;
    return t("volunteer");
  };

  console.log(volunteerData);

  return (
    <div className="volunteer-detail">
      <div className="volunteer-detail__title">{t("volunteer_detail")}</div>
      <Row>
        <Col span={14} />
        <Col span={6}>
          <Button type="primary" className="edit-volunteer-button">
            <Link to={`/volunteers/${id}/edit`}>{t("edit_volunteer")}</Link>
          </Button>
        </Col>
        <Col span={4}>
          <Button
            type="danger"
            className="delete-volunteer-button"
            onClick={openDeletePopup}
          >
            {t("delete_volunteer")}
          </Button>
        </Col>
      </Row>
      {volunteerData && (
        <>
          <Row>
            <Col span={4} className="label-text">
              {t("user_name")}
            </Col>
            <Col span={16}>{volunteerData.name}</Col>
          </Row>
          <Row>
            <Col span={4} className="label-text">
              {t("email")}
            </Col>
            <Col span={16}>{volunteerData.email}</Col>
          </Row>
          <Row>
            <Col span={4} className="label-text">
              {t("address")}
            </Col>
            <Col span={16}>{volunteerData.address}</Col>
          </Row>
          <Row>
            <Col span={4} className="label-text">
              {t("phone_number")}
            </Col>
            <Col span={16}>{volunteerData.phoneNumber}</Col>
          </Row>
          <Row>
            <Col span={4} className="label-text">
              {t("role")}
            </Col>
            <Col span={16}>{transformRoleWithClass(volunteerData.className, volunteerData.role)}</Col>
          </Row>
        </>
      )}
      <Modal
        title={t("modal_confirm_delete_volunteer_title")}
        visible={confirmDelete}
        onOk={deleteClass}
        onCancel={cancelDelete}
        okText={t("delete_volunteer")}
        cancelText={t("cancel")}
        footer={[
          <Button onClick={cancelDelete}>{t("cancel")}</Button>,
          <Button onClick={deleteClass} type="danger">
            {t("delete_volunteer")}
          </Button>,
        ]}
      >
        {t("modal_confirm_delete_volunteer_content")}
      </Modal>
    </div>
  );
}

export default VolunteerDetail;
