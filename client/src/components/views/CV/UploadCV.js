import { Button, Checkbox, Form, Input, Select, Table } from "antd";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./upload-cv.scss";
import * as Yup from "yup";
import {
  LIMIT_PDF_FILE_SIZE,
  NOON_TIME,
  phoneRegExp,
  WEEKDAY,
} from "../../common/constant";
import { calcFileSize } from "../../common/function";
import useFetchClassNameList from "../../../hook/useFetchClassNameList";
import Axios from "axios";
import ThanksPage from "./ThanksPage";

const { Item } = Form;
const { Option } = Select;
const { TextArea } = Input;

function UploadCV(props) {
  const { t } = useTranslation();
  const classList = useFetchClassNameList();
  const [firstPage, setFirstPage] = useState(true);
  const [isSubmmited, setSubmitted] = useState(false);

  const columns = [
    {
      title: "",
      dataIndex: "time",
      fixed: true,
      width: 120,
    },
  ];

  WEEKDAY.map((item) => {
    if (item.key !== 0)
      columns.push({
        title: item.text,
        key: item.key,
        dataIndex: "status",
        render: (record) => (
          <Checkbox
            text={`${item.key}-${record.key}`}
            onChange={(e) => setFreeTime(e)}
          >
            {record.active}
          </Checkbox>
        ),
      });
  });

  const setFreeTime = (e) => {
    const freeTimeList = formik.values.freeTime;
    formik.setFieldValue(
      "freeTime",
      e.target.checked
        ? [...freeTimeList, e.target.text]
        : freeTimeList.filter((item) => item !== e.target.text)
    );
  };

  const fixedData = NOON_TIME.map((item) => ({
    key: item.key,
    time: `${item.startTime} - ${item.endTime}`,
    status: {
      key: item.key,
      active: false,
    },
  }));

  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      phoneNumber: "",
      selectedClass: "",
      cvFile: "",
      freeTime: [],
      note: "",
    },
    validationSchema: Yup.object().shape({
      userName: Yup.string().required(t("required_name_message")),
      email: Yup.string()
        .email(t("invalid_email_message"))
        .required(t("required_email_message")),
      phoneNumber: Yup.string()
        .matches(phoneRegExp, t("invalid_phone_number"))
        .required(t("required_phone_number_message")),
      selectedClass: Yup.string().required(t("required_class_message")),
      cvFile: Yup.mixed()
        .required(t("required_file_message"))
        .test(
          "fileSize",
          `${t(`file_size_must_be_less_than`)} ${LIMIT_PDF_FILE_SIZE} MB`,
          (value) => {
            return value?.size <= calcFileSize(LIMIT_PDF_FILE_SIZE);
          }
        )
        .test("type", t("only_pdf_accept"), (value) => {
          return value && ["application/pdf"].includes(value.type);
        }),
      freeTime: Yup.array()
        .of(Yup.string())
        .test({
          message: t("required_free_time"),
          test: (arr) => arr.length >= 1,
        }),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setTimeout(() => {
        const formData = new FormData();
        for (var key in values) {
          formData.append(key, values[key]);
        }
        Axios.post(`/api/upload/upload-cv-file`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((response) => {
          if (response.data.success) {
            setSubmitted(true);
          } else if (!response.data.success) {
            alert(response.data.message);
          } else {
            alert(t("fail_to_get_api"));
          }
        });
        setSubmitting(false);
      }, 400);
    },
  });

  const handleChangeFile = (e) => {
    const file = e.target.files[0];
    let reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      formik.setFieldValue("cvFile", file);
    }
  };

  const fieldError = (formik) => {
    return (
      !formik.errors.userName &&
      !formik.errors.email &&
      !formik.errors.phoneNumber &&
      !formik.errors.cvFile &&
      !formik.errors.selectedClass &&
      !formik.errors.freeTime &&
      formik.touched.userName &&
      formik.touched.email &&
      formik.touched.phoneNumber &&
      formik.touched.cvFile
    );
  };

  if (isSubmmited) return <ThanksPage />;

  return (
    <div className="upload-cv__layout">
      <div className="upload-cv__title">{t("upload_cv")}</div>
      <Form
        layout="vertical"
        className="upload-cv__form"
        onSubmit={formik.handleSubmit}
      >
        {firstPage ? (
          <div>
            {" "}
            <Item label={t("user_name")} required>
              <Input
                name="userName"
                placeholder={t("input_name")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.userName && formik.touched.userName && (
                <span className="custom__error-message">
                  {formik.errors.userName}
                </span>
              )}
            </Item>
            <Item label={t("email")} required>
              <Input
                name="email"
                placeholder={t("input_email")}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.email && formik.touched.email && (
                <span className="custom__error-message">
                  {formik.errors.email}
                </span>
              )}
            </Item>
            <Item label={t("phone_number")} required>
              <Input
                name="phoneNumber"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder={t("input_phone_number")}
              />
              {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                <span className="custom__error-message">
                  {formik.errors.phoneNumber}
                </span>
              )}
            </Item>
            <Item label={t("register_class")} required>
              <Select
                showSearch
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                placeholder={t("input_select_class")}
                onChange={(value) =>
                  formik.setFieldValue("selectedClass", value)
                }
              >
                {classList.length
                  ? classList.map((option) => (
                      <Option key={option._id} value={option._id}>
                        {option.name}
                      </Option>
                    ))
                  : null}
              </Select>
              {formik.errors.selectedClass && formik.touched.selectedClass && (
                <span className="custom__error-message">
                  {formik.errors.selectedClass}
                </span>
              )}
            </Item>
            <hr />
            <Item label={t("uploads_your_cv")} required>
              <input
                type="file"
                accept=".pdf"
                name="cvFile"
                onChange={(e) => handleChangeFile(e)}
                onBlur={formik.handleBlur}
              />
              {formik.errors.cvFile && formik.touched.cvFile && (
                <span className="custom__error-message">
                  {formik.errors.cvFile}
                </span>
              )}
            </Item>
            <hr />
          </div>
        ) : (
          <>
            <Item label={t("free_time_table")} required>
              <Table
                className="upload-cv__free-time-table"
                columns={columns}
                dataSource={fixedData}
                pagination={false}
              ></Table>
              {formik.errors.freeTime && formik.touched.freeTime && (
                <span className="custom__error-message">
                  {formik.errors.freeTime}
                </span>
              )}
            </Item>
            <Item label={t("free_time_note")}>
              <TextArea
                name="note"
                rows={5}
                className="upload-cv__note-text"
                onChange={formik.handleChange}
              ></TextArea>
            </Item>
            <Button
              type="primary"
              htmlType="submit"
              className={
                !fieldError(formik)
                  ? "upload-cv__submit-button upload-cv__submit-button--disable"
                  : "upload-cv__submit-button"
              }
              disabled={!fieldError(formik)}
            >
              {t("submit")}
            </Button>
          </>
        )}
        <Button
          onClick={() => setFirstPage(!firstPage)}
          className={
            firstPage ? `upload-cv__button-next` : `upload-cv__button-prev`
          }
        >
          {firstPage ? `next_page` : `prev_page`}
        </Button>
      </Form>
    </div>
  );
}

export default UploadCV;
