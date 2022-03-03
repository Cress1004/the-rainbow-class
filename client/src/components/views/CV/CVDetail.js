import { Col, Row, Form, Button, Modal, Icon } from "antd";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import useFetchCVData from "../../../hook/CV/useFetchCVDetail";

import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Item } = Form;
const MAX_SCALE = 2.6;
const MIN_SCALE = 0.5;
const SCALE_STEP = 0.1;

function CVDetail(props) {
  const { t } = useTranslation();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const cvData = useFetchCVData();
  const [totalPages, setTotalPages] = useState(null);
  const [currentScale, setCurrentScale] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setTotalPages(numPages);
  }

  const changeScale = (offset) => {
    const newScale = currentScale + offset;
    if (newScale <= MAX_SCALE && newScale >= MIN_SCALE)
      setCurrentScale(currentScale + offset);
  };

  const zoomIn = () => changeScale(SCALE_STEP);
  const zoomOut = () => changeScale(-SCALE_STEP);

  const checkOverMaxScale = () => {
    return currentScale + SCALE_STEP > MAX_SCALE;
  };

  const checkOverMinScale = () => {
    return currentScale - SCALE_STEP < MIN_SCALE;
  };

  return (
    <div className="cv-detail">
      <div className="cv-detail__title">{t("cv_detail")}</div>
      <Row>
        <Col span={8}>
          <Form {...layout}>
            <Item label={t("user_name")}>{cvData.userName}</Item>
            <Item label={t("email")}>{cvData.email}</Item>
            <Item label={t("phone_number")}>{cvData.phoneNumber}</Item>
          </Form>
        </Col>
        <Col span={16} style={{ textAlign: "center" }}>
          <div className="cv-detail__scale-button">
            <Button onClick={zoomOut} disabled={checkOverMinScale()}>
              <Icon type="minus-circle" />
            </Button>
            <span>{Math.floor(currentScale * 100)}%</span>
            <Button onClick={zoomIn} disabled={checkOverMaxScale()}>
              <Icon type="plus-circle" />
            </Button>
          </div>
          <div className="all-page-container">
            <Document
              file={cvData.cvFileLink}
              options={{ workerSrc: "/pdf.worker.js" }}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              {Array.from(new Array(totalPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  scale={currentScale}
                />
              ))}
            </Document>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default CVDetail;
