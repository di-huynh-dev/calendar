/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  Select,
  TimePicker,
} from "antd";
import { ListOrdered, MapPin, Timer, Users } from "lucide-react";
import GoogleMeetIcon from "../assets/meet.png";
import dayjs from "dayjs";
import cities from "../data/city.json";
import wards from "../data/ward.json";
import districts from "../data/district.json";
import persons from "../data/person.json";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useCalendarStore } from "../store/useCalendarStore";
import toast from "react-hot-toast";

interface AddEventModalProps {
  selectedTime: Date | null;
  onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  selectedTime,
  onClose,
}) => {
  const { addEvent } = useCalendarStore();

  const handleCancel = () => {
    onClose();
  };

  const [form] = Form.useForm();
  const selectedCity = Form.useWatch(["location", "city"], form);
  const selectedDistrict = Form.useWatch(["location", "district"], form);

  const onFinish = (values: any) => {
    const { title, time, googleMeetLink, location, participants, description } =
      values;

    const selectedDate = time.date ? dayjs(time.date) : dayjs();
    const startTime = selectedDate
      .hour(dayjs(time.hour[0]).hour())
      .minute(dayjs(time.hour[0]).minute())
      .second(0);
    const endTime = selectedDate
      .hour(dayjs(time.hour[1]).hour())
      .minute(dayjs(time.hour[1]).minute())
      .second(0);

    const event = {
      id: dayjs().valueOf().toString(),
      title,
      start: startTime.toDate(),
      end: endTime.toDate(),
      googleMeetLink,
      location,
      participants,
      description,
    };

    console.log(event);
    addEvent(event);
    form.resetFields();
    onClose();
    toast.success("Sự kiện đã được thêm thành công");
  };

  const modulesQuill = {
    toolbar: [
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formatsQuill = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ];

  return (
    <Modal
      title={<p className="text-center font-bold">Thêm sự kiện mới</p>}
      open={!!selectedTime}
      onCancel={handleCancel}
      centered
      width={650}
      footer={null}
      maskClosable={true}
    >
      <Form
        form={form}
        name="events"
        onFinish={onFinish}
        colon={false}
        requiredMark={false}
        autoComplete="off"
        layout="horizontal"
        className="max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-w-1"
      >
        <Form.Item
          name="title"
          className="border-b-2 hover:border-orange-500 w-full ml-6"
        >
          <Input
            placeholder="Thêm tiêu đề"
            size="large"
            bordered={false}
            className="text-xl"
          />
        </Form.Item>

        <Form.Item label={<Users size={14} />}>
          <Row gutter={24}>
            <Col xs={24} sm={24}>
              <Form.Item name="participants">
                <Select
                  placeholder="Người tham gia"
                  showSearch
                  allowClear
                  mode="multiple"
                  tagRender={() => <></>}
                  filterOption={(input: string, option: any) => {
                    return (
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    );
                  }}
                  onChange={(value) => {
                    form.setFieldsValue({ participants: value });
                  }}
                >
                  {Object.values(persons).map((person) => (
                    <Select.Option key={person.id} value={person.id}>
                      <div className="flex items-center">
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="w-4 h-4 object-cover rounded-full mr-2"
                        />
                        <div>
                          <p>{person.name}</p>
                          <p>{person.email}</p>
                        </div>
                      </div>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item shouldUpdate noStyle>
                {({ getFieldValue }) => {
                  const selectedParticipants =
                    getFieldValue("participants") || [];
                  return (
                    <div className="mt-2">
                      {selectedParticipants.map((id: string) => {
                        const person = persons.find((p) => p.id === Number(id));
                        return (
                          <div key={id} className="flex items-center mb-2">
                            <img
                              src={person?.avatar}
                              alt={person?.name}
                              className="w-4 h-4 object-cover rounded-full mr-2"
                            />
                            <div>
                              <p>{person?.name}</p>
                              <p>{person?.email}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label={<Timer size={14} />}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name={["time", "date"]}
                initialValue={selectedTime ? dayjs(selectedTime) : dayjs()}
              >
                <DatePicker
                  className="w-full"
                  format={"DD-MM-YYYY"}
                  disabledDate={(current) => current.isBefore(dayjs(), "day")}
                  onChange={(date) => {
                    form.setFieldsValue({ time: { date } });
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name={["time", "hour"]}
                initialValue={
                  selectedTime
                    ? [dayjs(selectedTime), dayjs(selectedTime).add(1, "hour")]
                    : undefined
                }
              >
                <TimePicker.RangePicker
                  format={"hh:mm A"}
                  className="w-full"
                  minuteStep={15}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          label={
            <img
              src={GoogleMeetIcon}
              alt="GG meet icon"
              className="w-4 h-4 mr-2"
            ></img>
          }
        >
          <Row gutter={24}>
            <Form.Item
              name="googleMeetLink"
              className="border-b-2 hover:border-orange-500 w-full"
            >
              <Input placeholder="Thêm liên kết Google Meet" bordered={false} />
            </Form.Item>
          </Row>
        </Form.Item>
        <Form.Item label={<MapPin size={14} />}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item name={["location", "city"]}>
                <Select
                  placeholder="Thành phố"
                  showSearch
                  allowClear
                  filterOption={(input, option) => {
                    return (
                      option?.children
                        ?.toString()
                        .toLowerCase()
                        .includes(input.toLowerCase()) ?? false
                    );
                  }}
                  onChange={(value) => {
                    form.setFieldsValue({
                      location: {
                        city: value,
                        district: undefined,
                        ward: undefined,
                      },
                    });
                  }}
                >
                  {Object.values(cities).map((city) => (
                    <Select.Option key={city.code} value={city.code}>
                      {city.name_with_type}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name={["location", "district"]}>
                <Select
                  placeholder="Quận/huyện"
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                    option?.children
                      ?.toString()
                      .toLowerCase()
                      .includes(input.toLowerCase()) || false
                  }
                  onChange={(value) => {
                    form.setFieldsValue({
                      location: {
                        ...form.getFieldValue("location"),
                        district: value,
                        ward: undefined,
                      },
                    });
                  }}
                  disabled={!selectedCity}
                >
                  {Object.values(districts)
                    .filter((district) => district.parent_code === selectedCity)
                    .map((district) => (
                      <Select.Option key={district.code} value={district.code}>
                        {district.name_with_type}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name={["location", "ward"]}>
                <Select
                  placeholder="Phường/xã"
                  showSearch
                  allowClear
                  filterOption={(input, option) => {
                    return (
                      option?.children
                        ?.toString()
                        .toLowerCase()
                        .includes(input.toLowerCase()) ?? false
                    );
                  }}
                  onChange={(value) => {
                    form.setFieldsValue({
                      location: {
                        ...form.getFieldValue("location"),
                        ward: value,
                      },
                    });
                  }}
                  disabled={!selectedDistrict}
                >
                  {Object.values(wards)
                    .filter((ward) => ward.parent_code === selectedDistrict)
                    .map((ward) => (
                      <Select.Option key={ward.code} value={ward.code}>
                        {ward.name_with_type}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24}>
              <Form.Item
                className="border-b-2 hover:border-orange-500 w-full"
                name={["location", "address"]}
              >
                <Input placeholder="Địa chỉ cụ thể" bordered={false} />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        <Form.Item label={<ListOrdered size={14} />} name="description">
          <Col span={24}>
            <ReactQuill
              theme="snow"
              placeholder="Thêm mô tả hoặc tệp đính kèm trên Google Drive"
              onChange={(value) => form.setFieldsValue({ description: value })}
              modules={modulesQuill}
              formats={formatsQuill}
            />
            <style>
              {`
              .ql-toolbar .ql-video {
                margin: 0 auto; 
                display: block;
                width: 100%; 
              }
              .ql-video {
                width: 100%;
                height: 250px;
              }
              .ql-image {
                width: 100%;
                height: 150px;
              }
              .ql-tooltip.ql-editing{
                margin-top: -30px;
                left: 60px !important;
              }
            `}
            </style>
          </Col>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-8 shadow-lg"
          >
            Thêm sự kiện
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEventModal;
