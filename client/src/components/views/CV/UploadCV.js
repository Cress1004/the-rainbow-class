import { Button, Form, Input, Select } from "antd";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./upload-cv.scss";
import * as Yup from "yup";
import { LIMIT_PDF_FILE_SIZE, phoneRegExp } from "../../../common/constant";
import { calcFileSize } from "../../../common/function";
import useFetchClassNameList from "../../../../hook/useFetchClassNameList";
import Axios from "axios";
import ThanksPage from "./ThanksPage";

const { Item } = Form;
const { Option } = Select;

function UploadCV(props) {
  const { t } = useTranslation();
  const classList = useFetchClassNameList();
  const [isSubmmited, setSubmitted] = useState(false);
  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      phoneNumber: "",
      selectedClass: "",
      cvFile: "",
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
      formik.touched.userName &&
      formik.touched.email &&
      formik.touched.phoneNumber &&
      formik.touched.cvFile
    );
  };

  if(isSubmmited) return <ThanksPage />

  return (
    <div className="upload-cv__layout">
      <Form
        layout="vertical"
        className="upload-cv__form"
        onSubmit={formik.handleSubmit}
      >
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
            <span className="custom__error-message">{formik.errors.email}</span>
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
            onChange={(value) => formik.setFieldValue("selectedClass", value)}
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
      </Form>
    </div>
  );
}

export default UploadCV;
