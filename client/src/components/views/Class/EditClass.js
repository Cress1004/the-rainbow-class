import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import { useParams } from "react-router";
import {
  Form,
  Input,
  Select,
  Button,
  message,
  Row,
  Col,
  TimePicker,
  Icon,
} from "antd";
import { transformScheduleTime } from "../../common/transformData";
import { generateKey } from "../../common/function";
import { WEEKDAY, formatTimeSchedule } from "../../common/constant";

const { TextArea } = Input;
const { Option } = Select;
const { Item } = Form;

function EditClass(props) {
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
  const { id } = useParams();
  const [location, setLocation] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState("");
  const [classData, setClassData] = useState({});
  const [province, setProvince] = useState({});
  const [studentTypes, setStudentTypes] = useState([]);
  const [defaultSchedule, setDefaultSchedule] = useState([]);

  useEffect(() => {
    Axios.post("/api/common-data/location", null).then((response) => {
      if (response.data.success) {
        setLocation(response.data.location);
      } else {
        alert(t("fail_to_get_api_location"));
      }
    });

    Axios.post("/api/common-data/student-types", null).then((response) => {
      if (response.data.success) {
        setStudentTypes(response.data.studentTypes);
      } else {
        alert(t("fail_to_get_api_student_types"));
      }
    });

    Axios.post(`/api/classes/${id}`, { classId: id }).then((response) => {
      if (response.data.success) {
        const data = response.data.classData;
        setClassData({
          _id: data._id,
          name: data.name,
          description: data.description,
          address: data.address,
          studentTypes: data.studentTypes.map((type) => type._id),
          defaultSchedule: data.defaultSchedule,
        });
        if (data.address) {
          setProvince(data.address.address.province);
          setDistrict(data.address.address.district);
          setWard(data.address.address.ward);
        }
        setDefaultSchedule(data.defaultSchedule);
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t, id]);

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
      startTime: undefined,
      endTime: undefined,
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
      Axios.post(`/api/classes/${id}/edit`, classData).then((response) => {
        if (response.data.success) {
          openMessage();
          history.push(`/classes/${id}`);
        } else {
          alert(t("fail_to_get_api"));
        }
      });
      return classData;
    });
  };

  const openMessage = () => {
    message.loading({ content: t("loading"), key });
    setTimeout(() => {
      message.success({ content: t("save_success"), key, duration: 3 });
    }, 1000);
  };

  const schedule = (
    <>
      {defaultSchedule &&
        defaultSchedule.map((item) => (
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

  return (
    <div className="edit-class">
      <div className="edit-class__title">{t("edit_class")}</div>
      {classData && (
        <Form {...layout} name="control-hooks" onSubmit={handleSubmit}>
          <Item
            name="name"
            label={t("class_name")}
            rules={[
              { required: true, validateMessages: t("required_class_name") },
            ]}
          >
            <Input
              value={classData.name}
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
              value={classData.description}
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
              value={province.name}
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
              value={district.name}
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
              value={ward.name}
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
              value={classData.address ? classData.address.description : ""}
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
              value={classData.studentTypes}
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
              {t("update")}
            </Button>
          </Item>
        </Form>
      )}
    </div>
  );
}

export default EditClass;
