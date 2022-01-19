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
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import "./lesson.scss";
import {
  WEEKDAY,
  FORMAT_TIME_SCHEDULE,
  OFFLINE_OPTION,
  ONLINE_OPTION,
} from "../../../common/constant";
import {
  convertTimeStringToMoment,
  convertDateStringToMoment,
} from "../../../common/transformData";
import { generateKey } from "../../../common/function";

const { Item } = Form;
const { TextArea } = Input;
const { Option } = Select;

function EditLesson(props) {
  const { t } = useTranslation();
  const { id, lessonId } = useParams();
  const [location, setLocation] = useState([]);
  const [province, setProvince] = useState("");
  const [districts, setDistricts] = useState([]);
  const [district, setDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [ward, setWard] = useState("");
  const [defaultSchedule, setDefaultSchedule] = useState({});
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
    Axios.post(`/api/classes/${id}/lessons/${lessonId}`, {
      lessonId: lessonId,
    }).then((response) => {
      if (response.data.success) {
        const data = response.data.lessonData;
        setLessonData({
          _id: data._id,
          scheduleId: data.schedule._id,
          teachOption: data.schedule.teachOption,
          linkOnline: data.schedule.linkOnline,
          title: data.title,
          description: data.description,
          address: data.schedule.address,
          // paticipants: data.schedule.paticipants,
        });
        setTime(data.schedule.time);
        if (data.schedule.address) {
          setProvince(data.schedule.address.address.province);
          setDistrict(data.schedule.address.address.district);
          setWard(data.schedule.address.address.ward);
        }
      } else {
        alert(t("fail_to_get_api"));
      }
    });
  }, [t, id, lessonId]);

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
      ...lessonData,
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

  const onChangeDate = (e, dateString) => {
    const dayOfWeek = e._d.toString().split(" ")[0];
    const key = WEEKDAY.find((item) => item.value === dayOfWeek).key;
    const newTime = classData.defaultSchedule.find(
      (item) => item.dayOfWeek === key
    );
    setDefaultSchedule(newTime);
    newTime
      ? setTime({
          key: newTime.key,
          date: dateString,
          startTime: newTime.startTime,
          endTime: newTime.endTime,
          dayOfWeek: newTime.dayOfWeek,
        })
      : setTime({
          ...time,
          key: generateKey(),
          date: dateString,
          dayOfWeek: key,
          endTime: undefined,
          startTime: undefined,
        });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLessonData({
      ...lessonData,
      classId: id,
      time: time,
    });
    setLessonData((lessonData) => {
      Axios.post(`/api/classes/${id}/lessons/${lessonId}/edit`, {
        lessonData: lessonData,
      }).then((response) => {
        if (response.data.success) {
          // history.push(`/classes/${id}`);
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
        value={lessonData.address ? lessonData.address.description : undefined}
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
            value={lessonData.title}
            placeholder={t("input_lesson_name")}
            onChange={(e) =>
              setLessonData({ ...lessonData, title: e.target.value })
            }
          />
        </Item>
        <Item name="description" label={t("description")}>
          <TextArea
            value={lessonData.description}
            placeholder={t("input_description")}
            onChange={(e) =>
              setLessonData({ ...lessonData, description: e.target.value })
            }
          />
        </Item>
        <Item name="teachOption" label={t("teach_option")}>
          <Radio.Group
            value={lessonData.teachOption}
            onChange={(e) =>
              setLessonData({ ...lessonData, teachOption: e.target.value })
            }
          >
            <Radio value={OFFLINE_OPTION}>{t("offline")}</Radio>
            <Radio value={ONLINE_OPTION}>{t("online")}</Radio>
          </Radio.Group>
        </Item>
        {lessonData.teachOption === OFFLINE_OPTION ? (
          <div>{offlineAddress}</div>
        ) : (
          <div>
            <Item name="linkOnline" label={t("link_online")}>
              <Input
                value={lessonData.linkOnline}
                placeholder="input_link"
                onChange={(e) =>
                  setLessonData({ ...lessonData, linkOnline: e.target.value })
                }
              ></Input>
            </Item>
          </div>
        )}
        {time && (
          <Item name="time" label={t("schedule")}>
            <Col span={8}>
              <DatePicker
                value={convertDateStringToMoment(time.date)}
                onChange={onChangeDate}
                placeholder="date_placeholder"
              />
            </Col>
            <Col span={2}>{t("from")}</Col>
            <Col span={5}>
              <TimePicker
                format={FORMAT_TIME_SCHEDULE}
                value={convertTimeStringToMoment(time.startTime)}
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
                value={convertTimeStringToMoment(time.endTime)}
                placeholder="time_placeholder"
                onChange={(e) =>
                  setTime({ ...time, endTime: e._d ? e._d : undefined })
                }
              />
            </Col>
          </Item>
        )}
        <Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            {t("update")}
          </Button>
        </Item>
      </Form>
    </div>
  );
}

export default EditLesson;
