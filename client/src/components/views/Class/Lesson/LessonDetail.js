import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import Axios from "axios";
import { useTranslation } from "react-i18next";
import { Row, Dropdown, Icon, Col, Menu, Button, Modal } from "antd";
import {
  getArrayLength,
  transformAddressData,
  transformLessonTimeToString,
} from "../../../common/transformData";
import { OFFLINE_OPTION } from "../../../common/constant";

function LessonDetail(props) {
  const { t } = useTranslation();
  const { id, lessonId } = useParams();
  const history = useHistory();
  const [lessonData, setLessonData] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    Axios.post(`/api/classes/${id}/lessons/${lessonId}`, {
      lessonId: lessonId,
    }).then((response) => {
      if (response.data.success) {
        const data = response.data.lessonData;
        setLessonData({
          teachOption: data.schedule.teachOption,
          linkOnline: data.schedule.linkOnline,
          title: data.title,
          description: data.description,
          address: transformAddressData(data.schedule.address),
          time: transformLessonTimeToString(data.schedule.time),
          paticipants: data.schedule.paticipants,
        });
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t, id, lessonId]);

  const openDeletePopup = () => {
    setConfirmDelete(true);
  };

  const deleteLesson = () => {
    setConfirmDelete(false);
    Axios.post(`/api/classes/${id}/lessons/${lessonId}}/delete`, {
      lessonId: lessonId,
    }).then((response) => {
      if (response.data.success) {
        alert(t("delete_lesson_success"));
        history.push(`/classes/${id}/`);
      } else {
        alert(t("fail_to_delete_lesson"));
      }
    });
  };

  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link to={`/classes/${id}/lessons/${lessonId}/edit`}>
          {t("edit_lesson")}
        </Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item
        key="1"
        className="lesson-detail__delete-lesson"
        onClick={openDeletePopup}
      >
        {t("delete_lesson")}
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="lesson-detail">
      <Row>
        <div className="lesson-detail__title">{t("lesson_detail")}</div>
        <div className="lesson-detail__more-option">
          <Dropdown overlay={menu} trigger={["click"]}>
            <a
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              <Icon type="more" />
            </a>
          </Dropdown>
        </div>
      </Row>
      <div className="lesson-detail__info-area">
        {" "}
        {lessonData && (
          <>
            <Row>
              <Col span={4} className="label-text">
                {t("lesson_name")}
              </Col>
              <Col span={16}>{lessonData.title}</Col>
            </Row>
            <Row>
              <Col span={4} className="label-text">
                {t("description")}
              </Col>
              <Col span={16}>{lessonData.description}</Col>
            </Row>
            <Row>
              <Col span={4} className="label-text">
                {t("teach_option")}
              </Col>{" "}
              {lessonData.teachOption === OFFLINE_OPTION ? (
                <Col span={16}>
                  <Row>{t("offline")}</Row>
                  <Row>{lessonData.address}</Row>
                </Col>
              ) : (
                <Col span={16}>
                  <Row>{t("online")}</Row>
                  <Row>{lessonData.linkOnline}</Row>
                </Col>
              )}
            </Row>
            <Row>
              <Col span={4} className="label-text">
                {t("schedule_time")}
              </Col>
              <Col span={16}>{lessonData.time}</Col>
            </Row>
            <hr />
            <Row>
              <Col span={12}>
                {`${t("paticipants")} - ${
                  getArrayLength(lessonData.paticipants)
                    ? getArrayLength(lessonData.paticipants)
                    : t("unregister_person")
                }`}
              </Col>
            </Row>
            {/* Paticipant list and assign parson incharge */}
          </>
        )}
      </div>
      <Modal
        title={t("modal_confirm_delete_lesson_title")}
        visible={confirmDelete}
        onOk={deleteLesson}
        onCancel={cancelDelete}
        okText={t("delete_lesson")}
        cancelText={t("cancel")}
        footer={[
          <Button onClick={cancelDelete}>{t("cancel")}</Button>,
          <Button onClick={deleteLesson} type="danger">
            {t("delete_lesson")}
          </Button>,
        ]}
      >
        {t("modal_confirm_delete_lesson_content")}
      </Modal>
    </div>
  );
}

export default LessonDetail;
