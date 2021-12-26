import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  TimePicker,
  Icon,
  Row,
  Col,
} from "antd";
import { useHistory } from "react-router";
import { WEEKDAY, formatTimeSchedule } from "../../common/constant";
import { generateKey } from "../../common/function";
import { transformScheduleTime } from "../../common/transformData";

const { Option } = Select;
const { TextArea } = Input;
const { Item } = Form;

function AddClass(props) {
  const { t } = useTranslation();
  const history = useHistory();
  const key = "updatable";
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  const [location, setLocation] = useState([]);
  const [province, setProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState("");
  const [classData, setClassData] = useState([]);
  const [defaultSchedule, setDefaultSchedule] = useState([
    {
      key: generateKey(),
      dayOfWeek: undefined,
      startTime: "00:00",
      endTime: "00:00",
    },
  ]);

  const [studentTypes, setStudentTypes] = useState([]);
  useEffect(() => {
    Axios.post("/api/common-data/location", null).then((response) => {
      if (response.data.success) {
        setLocation(response.data.location);
      } else {
        alert(t("fail_to_get_api"));
      }
    });

    Axios.post("/api/common-data/student-types", null).then((response) => {
      if (response.data.success) {
        setStudentTypes(response.data.studentTypes);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t]);

  const handleChangeProvice = (value) => {
    const currentProvince = location.find((item) => value === item.id);
    setProvince({ id: currentProvince.id, name: currentProvince.name });
    setDistricts(currentProvince.districts);
    setDistrict({});
    setWard({});
    setClassData({
      ...classData,
      address: {
        address: {
          province: {
            id: currentProvince.id,
            name: currentProvince.name,
          },
        },
      },
    });
  };

  const handleChangeDistrict = (value) => {
    const currentDistrict = districts.find((item) => value === item.id);
    setDistrict({ id: currentDistrict.id, name: currentDistrict.name });
    setWards(currentDistrict.wards);
    setWard({});
    setClassData({
      ...classData,
      address: {
        address: {
          province: classData.address.address.province,
          district: {
            id: currentDistrict.id,
            name: currentDistrict.name,
          },
        },
      },
    });
  };

  const handleChangeWard = (value) => {
    const currentWard = wards.find((item) => value === item.id);
    setWard({ id: currentWard.id, name: currentWard.name });
    setClassData({
      ...classData,
      address: {
        address: {
          province: classData.address.address.province,
          district: classData.address.address.district,
          ward: {
            id: currentWard.id,
            name: currentWard.name,
          },
        },
      },
    });
  };

  const handleChangeAddressDescription = (e) => {
    setClassData({
      ...classData,
      address: {
        address: classData.address.address,
        description: e.target.value,
      },
    });
  };

  const addNewDefaultSchedule = () => {
    const newSchedule = {
      key: generateKey(),
      dayOfWeek: undefined,
      startTime: "00:00",
      endTime: "00:00",
    };
    setDefaultSchedule([...defaultSchedule, newSchedule]);
  };

  const deleteDefaultSchedule = (e, key) => {
    const newSchedule = defaultSchedule.filter(
      (schedule) => schedule.key !== key
    );
    setDefaultSchedule(newSchedule);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setClassData({ ...classData, defaultSchedule: defaultSchedule });
    setClassData((classData) => {
      Axios.post("/api/classes/add-class", classData).then((response) => {
        if (response.data.success) {
          openMessage();
          history.push("/classes");
        } else {
          alert(t("fail_to_get_api"));
        }
      });
      return classData;
    });
  };

  const schedule = (
    <>
      {defaultSchedule.map((item) => (
        <Row>
          <Col span={8}>
            <Select
              value={item.dayOfWeek}
              showSearch
              placeholder={t("input_weekday")}
              onChange={(value) =>
                setDefaultSchedule(
                  [...defaultSchedule].map((object) => {
                    if (object.key === item.key) {
                      return {
                        ...object,
                        dayOfWeek: value,
                      };
                    } else return object;
                  })
                )
              }
            >
              {WEEKDAY.map((option) => (
                <Option key={option.key} value={option.key}>
                  {option.text}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={2}>{t("from")}</Col>
          <Col span={5}>
            <TimePicker
              format={formatTimeSchedule}
              value={transformScheduleTime(item.startTime)}
              placeholder="time_placeholder"
              onChange={(e) =>
                setDefaultSchedule(
                  [...defaultSchedule].map((object) => {
                    if (object.key === item.key) {
                      return {
                        ...object,
                        startTime: e._d ? e._d : undefined,
                      };
                    } else return object;
                  })
                )
              }
            />
          </Col>
          <Col span={2}>{t("to")}</Col>
          <Col span={5}>
            <TimePicker
              format={formatTimeSchedule}
              value={transformScheduleTime(item.endTime)}
              placeholder="time_placeholder"
              onChange={(e) =>
                setDefaultSchedule(
                  [...defaultSchedule].map((object) => {
                    if (object.key === item.key) {
                      return {
                        ...object,
                        endTime: e._d ? e._d : undefined,
                      };
                    } else return object;
                  })
                )
              }
            />
          </Col>
          <Col span={2}>
            <Icon
              type="close-circle"
              onClick={(e) => deleteDefaultSchedule(e, item.key)}
            />
          </Col>
        </Row>
      ))}
      <Icon type="plus-circle" onClick={addNewDefaultSchedule} />
    </>
  );

  const openMessage = () => {
    message.loading({ content: t("loading"), key });
    setTimeout(() => {
      message.success({ content: t("save_success"), key, duration: 3 });
    }, 1000);
  };

  return (
    <div className="add-class">
      <div className="add-class__title">{t("add_class")}</div>
      <Form {...layout} name="control-hooks" onSubmit={handleSubmit}>
        <Item
          name="name"
          label={t("class_name")}
          rules={[
            { required: true, validateMessages: t("required_class_name") },
          ]}
        >
          <Input
            placeholder={t("input_class_name")}
            onChange={(e) =>
              setClassData({ ...classData, name: e.target.value })
            }
          />
        </Item>
        <Item
          name="description"
          label={t("description")}
          rules={[
            { required: true, validateMessages: t("required_description") },
          ]}
        >
          <TextArea
            placeholder={t("input_description")}
            onChange={(e) =>
              setClassData({ ...classData, description: e.target.value })
            }
          />
        </Item>
        <Item name="address" label={t("address")}>
          <Select
            showSearch
            style={{
              display: "inline-block",
              width: "calc(33% - 12px)",
              marginRight: "10px",
            }}
            placeholder={t("input_province")}
            onChange={handleChangeProvice}
          >
            {location.map((option) => (
              <Option key={option._id} value={option.id}>
                {option.name}
              </Option>
            ))}
          </Select>
          <Select
            showSearch
            style={{
              display: "inline-block",
              width: "calc(33% - 12px)",
              margin: "0px 10px",
            }}
            placeholder={t("input_district")}
            onChange={handleChangeDistrict}
          >
            {districts.length
              ? districts.map((option) => (
                  <Option key={option._id} value={option.id}>
                    {option.name}
                  </Option>
                ))
              : null}
          </Select>
          <Select
            showSearch
            style={{
              display: "inline-block",
              width: "calc(33% - 12px)",
              marginLeft: "10px",
            }}
            placeholder={t("input_ward")}
            onChange={handleChangeWard}
          >
            {wards.length
              ? wards.map((option) => (
                  <Option key={option._id} value={option.id}>
                    {option.name}
                  </Option>
                ))
              : null}
          </Select>
          <Input
            placeholder={t("input_specific_address")}
            onChange={(e) => handleChangeAddressDescription(e)}
          />
        </Item>
        <Item name="studentType" label={t("student_type")}>
          <Select
            mode="multiple"
            showSearch
            style={{
              display: "inline-block",
              width: "100%",
              marginRight: "10px",
            }}
            placeholder={t("input_student_type")}
            onChange={(value) =>
              setClassData({ ...classData, studentTypes: value })
            }
          >
            {studentTypes.map((option) => (
              <Option key={option._id} value={option._id}>
                {option.title}
              </Option>
            ))}
          </Select>
        </Item>
        <Item name="time" label={t("default_schedule")}>
          {schedule}
        </Item>
        <Item {...tailLayout}>
          <Button type="primary" htmlType="submit" onClick={openMessage}>
            {t("register")}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default AddClass;
