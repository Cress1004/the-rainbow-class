import { Col } from "antd";
import { DatePicker } from "antd";
import { TimePicker } from "antd";
import { Modal } from "antd";
import { Button } from "antd";
import { Form } from "antd";
import moment from "moment";
import React from "react";
import { FORMAT_TIME_SCHEDULE } from "../../../common/constant";
import FreeTimeTable from "./FreeTimeTable";

const { Item } = Form;

function SetInterviewTime(props) {
  const {
    t,
    confirmInterview,
    setConfirmInterview,
    formik,
    columns,
    fixedData,
    interviewData
  } = props;

  const cancelModal = () => {
    setConfirmInterview(false);
  };

  const checkFillAllData = () => {
    return (
      formik.values.date && formik.values.endTime && formik.values.startTime
    );
  };

  const onChangeDate = (date, dateString) => {
    formik.setFieldValue("date", dateString);
  };

  const onChangeStartTime = (time, timeString) => {
    formik.setFieldValue("startTime", timeString);
  };

  const onChangeEndTime = (time, timeString) => {
    formik.setFieldValue("endTime", timeString);
  };

  return (
    <Modal
      title={t("set_interview_time")}
      visible={confirmInterview}
      onOk={formik.handleSubmit}
      onCancel={cancelModal}
      width="60%"
      footer={[
        <Button key="cancel" onClick={cancelModal}>
          {t("cancel")}
        </Button>,
        <Button
          key="ok"
          type="primary"
          onClick={formik.handleSubmit}
          disabled={!checkFillAllData()}
        >
          {t("ok")}
        </Button>,
      ]}
    >
      <Form>
        <Item label={t("input_interview_time")}>
          <Col span={8}>
            <DatePicker
              onChange={onChangeDate}
              placeholder="date_placeholder"
              defaultValue={interviewData ? moment(interviewData.date) : undefined}
            />
          </Col>
          <Col span={2}>{t("from")}</Col>
          <Col span={5}>
            <TimePicker
              format={FORMAT_TIME_SCHEDULE}
              placeholder="time_placeholder"
              onChange={onChangeStartTime}
              defaultValue={interviewData ? moment(interviewData.startTime, FORMAT_TIME_SCHEDULE) : undefined}
            />
          </Col>
          <Col span={2}>{t("to")}</Col>
          <Col span={5}>
            <TimePicker
              format={FORMAT_TIME_SCHEDULE}
              placeholder="time_placeholder"
              onChange={onChangeEndTime}
              defaultValue={interviewData ? moment(interviewData.endTime, FORMAT_TIME_SCHEDULE) : undefined}
            />
          </Col>
        </Item>
      </Form>
      {t("applier_free_time")}
      <FreeTimeTable t={t} columns={columns} fixedData={fixedData} />
    </Modal>
  );
}

export default SetInterviewTime;
