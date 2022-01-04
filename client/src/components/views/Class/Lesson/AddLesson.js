import React, { useEffect, useState } from "react";
import {
  Row,
  Form,
  Select,
  Input,
  Button,
  Radio,
  DatePicker,
  TimePicker,
  Col,
} from "antd";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import "./lesson.scss";
import { WEEKDAY, FORMAT_TIME_SCHEDULE, OFFLINE_OPTION, ONLINE_OPTION } from "../../../common/constant";
import { transformScheduleTime } from "../../../common/transformData";
import { generateKey } from "../../../common/function";

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

function AddLesson(props) {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();
  const [location, setLocation] = useState([]);
  const [province, setProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState("");
  const [defaultSchedule, setDefaultSchedule] = useState({});
  const [teachOption, setTeachOption] = useState(OFFLINE_OPTION);
  const [classData, setClassData] = useState({});
  const [lessonData, setLessonData] = useState({});
  const [time, setTime] = useState({});
  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };
  const tailLayout = {
    wrapperCol: { offset: 18, span: 4 },
  };

  useEffect(() => {
    Axios.post(`/api/classes/${id}`, { classId: id }).then((response) => {
      if (response.data.success) {
        const data = response.data.classData;
        setClassData(data);
        if (data.address) {
          setLessonData({ ...lessonData, address: data.address });
          setProvince(data.address.address.province);
          setDistrict(data.address.address.district);
          setWard(data.address.address.ward);
        }
      } else {
        alert(t("fail_to_get_api"));
      }
    });
    Axios.post("/api/common-data/location", null).then((response) => {
      if (response.data.success) {
        setLocation(response.data.location);
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
    setLessonData({
      ...lessonData,
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
    setLessonData({
      ...lessonData,
      address: {
        address: {
          province: lessonData.address.address.province,
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
    setLessonData({
      ...setLessonData,
      address: {
        address: {
          province: lessonData.address.address.province,
          district: lessonData.address.address.district,
          ward: {
            id: currentWard.id,
            name: currentWard.name,
          },
        },
      },
    });
  };

  const handleChangeAddressDescription = (e) => {
    setLessonData({
      ...lessonData,
      address: {
        address: lessonData.address.address,
        description: e.target.value,
      },
    });
  };

  const onChangeDate = (e) => {
    const dayOfWeek = e._d.toString().split(" ")[0];
    const key = WEEKDAY.find((item) => item.value === dayOfWeek).key;
    const time = classData.defaultSchedule.find(
      (item) => item.dayOfWeek === key
    );
    setDefaultSchedule(time);
    time
      ? setTime({
          key: time.key,
          date: e._d,
          startTime: time.startTime,
          endTime: time.endTime,
          dayOfWeek: time.dayOfWeek,
        })
      : setTime({
          ...time,
          key: generateKey(),
          dayOfWeek: key,
          date: e._d,
          endTime: undefined,
          startTime: undefined,
        });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLessonData({
      ...lessonData,
      classId: id,
      teachOption: teachOption,
      time: time,
    });
    setLessonData((lessonData) => {
      Axios.post(`/api/classes/${id}/add-lesson`, lessonData).then((response) => {
        if (response.data.success) {
          history.push(`/classes/${id}`);
        } else {
          alert(t("fail_to_get_api"));
        }
      });
      return lessonData;
    });
  };

  const offlineAddress = (
    <Item name="add-lesson__offline-address" label={t("address")}>
      <Select
        showSearch
        style={{
          display: "inline-block",
          width: "calc(33% - 12px)",
          marginRight: "10px",
        }}
        value={province ? province.name : undefined}
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
        value={district ? district.name : undefined}
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
        value={ward ? ward.name : undefined}
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
        value={classData.address ? classData.address.description : undefined}
        onChange={(e) => handleChangeAddressDescription(e)}
      />
    </Item>
  );

  return (
    <div className="add-lesson">
      <Row className="add-lesson__title">
        {t("add_lesson")} - {classData.name}
      </Row>
      <Form {...layout} name="control-hooks" onSubmit={handleSubmit}>
        <Item name="name" label={t("lesson_name")}>
          <Input
            placeholder={t("input_lesson_name")}
            onChange={(e) =>
              setLessonData({ ...lessonData, title: e.target.value })
            }
          />
        </Item>
        <Item name="description" label={t("description")}>
          <TextArea
            placeholder={t("input_description")}
            onChange={(e) =>
              setLessonData({ ...lessonData, description: e.target.value })
            }
          />
        </Item>
        <Item name="teachOption" label={t("teach_option")}>
          <Radio.Group
            defaultValue={teachOption}
            onChange={(e) => setTeachOption(e.target.value)}
          >
            <Radio value={OFFLINE_OPTION}>{t("offline")}</Radio>
            <Radio value={ONLINE_OPTION}>{t("online")}</Radio>
          </Radio.Group>
        </Item>
        {teachOption === OFFLINE_OPTION ? (
          <div>{offlineAddress}</div>
        ) : (
          <div>
            <Item name="linkOnline" label={t("link_online")}>
              <Input
                placeholder="input_link"
                onChange={(e) =>
                  setLessonData({ ...lessonData, linkOnline: e.target.value })
                }
              ></Input>
            </Item>
          </div>
        )}
        <Item name="time" label={t("schedule")}>
          <Col span={8}>
            <DatePicker
              onChange={onChangeDate}
              placeholder="date_placeholder"
            />
          </Col>
          <Col span={2}>{t("from")}</Col>
          <Col span={5}>
            <TimePicker
              format={FORMAT_TIME_SCHEDULE}
              value={time ? transformScheduleTime(time.startTime) : undefined}
              placeholder="time_placeholder"
              onChange={(e) =>
                setTime({ ...time, startTime: e._d ? e._d : undefined })
              }
            />
          </Col>
          <Col span={2}>{t("to")}</Col>
          <Col span={5}>
            <TimePicker
              format={FORMAT_TIME_SCHEDULE}
              value={time ? transformScheduleTime(time.endTime) : undefined}
              placeholder="time_placeholder"
              onChange={(e) =>
                setTime({ ...time, endTime: e._d ? e._d : undefined })
              }
            />
          </Col>
        </Item>
        <Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {t("register")}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default AddLesson;
