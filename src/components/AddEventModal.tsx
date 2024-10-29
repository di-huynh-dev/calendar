/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Button,
  Col,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Select,
  TimePicker,
  Tooltip,
} from "antd";
import {
  ListOrdered,
  MapPin,
  Palette,
  Pencil,
  Timer,
  Trash,
  Undo2,
  Users,
  X,
} from "lucide-react";
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
import { useEffect, useState } from "react";

interface AddEventModalProps {
  selectedTime: Date | null;
  onClose: () => void;
  selectedEvent: any;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  selectedTime,
  selectedEvent,
  onClose,
}) => {
  const { addEvent, removeEvent, updateEvent } = useCalendarStore();
  const isEditMode = Boolean(selectedEvent);
  const [isEditing, setIsEditing] = useState(!isEditMode);

  const [form] = Form.useForm();

  useEffect(() => {
    if (isEditMode && selectedEvent) {
      form.setFieldsValue({
        title: selectedEvent.title,
        time: {
          date: dayjs(selectedEvent.start),
          hour: [dayjs(selectedEvent.start), dayjs(selectedEvent.end)],
        },
        googleMeetLink: selectedEvent.googleMeetLink,
        location: selectedEvent.location,
        participants: selectedEvent.participants,
        description: selectedEvent.description,
        colorTag: selectedEvent.colorTag,
      });
    } else {
      form.resetFields();
    }
  }, [selectedEvent, form, isEditMode]);

  const selectedCity = Form.useWatch(["location", "city"], form);
  const selectedDistrict = Form.useWatch(["location", "district"], form);

  const onFinish = (values: any) => {
    const {
      title,
      time,
      googleMeetLink,
      location,
      participants,
      description,
      colorTag,
    } = values;

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
      id: isEditMode ? selectedEvent.id : dayjs().valueOf().toString(),
      title,
      start: startTime.toDate(),
      end: endTime.toDate(),
      googleMeetLink,
      location,
      participants,
      description,
      colorTag,
    };

    if (isEditMode) {
      updateEvent(event);
      toast.success("Sự kiện đã được cập nhật");
    } else {
      addEvent(event);
      toast.success("Sự kiện đã được thêm thành công");
    }

    form.resetFields();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      removeEvent(selectedEvent.id);
      onClose();
      toast.success("Sự kiện đã được xóa thành công");
    }
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
      title={
        <div className="flex items-center justify-between">
          <p className="text-center font-bold">
            {isEditMode ? "Chi tiết sự kiện" : "Thêm sự kiện mới"}
          </p>
          <div className="flex gap-4 items-center">
            {isEditMode && (
              <>
                {isEditing ? (
                  <Tooltip title="Hủy chỉnh sửa">
                    <Popconfirm
                      title="Xác nhận hủy thay đổi"
                      onConfirm={() => {
                        setIsEditing(false);
                      }}
                    >
                      <button>
                        <Undo2 size={16} />
                      </button>
                    </Popconfirm>
                  </Tooltip>
                ) : (
                  <>
                    <Tooltip title="Chỉnh sửa sự kiện">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                        }}
                      >
                        <Pencil size={16} />
                      </button>
                    </Tooltip>
                    <Tooltip title="Xóa sự kiện">
                      <Popconfirm
                        title="Xác nhận Xóa sự kiện"
                        onConfirm={handleDeleteEvent}
                      >
                        <button>
                          <Trash size={16} />
                        </button>
                      </Popconfirm>
                    </Tooltip>
                  </>
                )}
              </>
            )}

            <button onClick={handleCancel}>
              <X size={16} />
            </button>
          </div>
        </div>
      }
      open
      onCancel={handleCancel}
      centered
      width={650}
      footer={null}
      maskClosable={true}
      closable={false}
    >
      <Form
        form={form}
        name="events"
        onFinish={onFinish}
        colon={false}
        requiredMark={false}
        autoComplete="off"
        layout="horizontal"
        disabled={!isEditing}
        className="max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-w-1"
      >
        <Form.Item
          name="title"
          className={`w-full ml-6 border-b-2 ${
            isEditing ? " hover:border-orange-500" : ""
          }`}
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
                          className="w-6 h-6 object-cover rounded-full mr-2"
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
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {selectedParticipants.map((id: string) => {
                        const person = persons.find((p) => p.id === Number(id));
                        return (
                          <div key={id} className="flex items-center mb-2">
                            <img
                              src={person?.avatar}
                              alt={person?.name}
                              className="w-6 h-6 object-cover rounded-full mr-2"
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
              className={`w-full ml-6 border-b-2 ${
                isEditing ? "hover:border-orange-500" : ""
              }`}
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
                  disabled={!selectedCity || !isEditing}
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
                  disabled={!selectedDistrict || !isEditing}
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
                className={`w-full ml-6 border-b-2 ${
                  isEditing ? " hover:border-orange-500" : ""
                }`}
                name={["location", "address"]}
              >
                <Input placeholder="Địa chỉ cụ thể" bordered={false} />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label={<Palette size={14} />} name="colorTag">
          <ColorPicker
            allowClear
            showText
            onChange={(color) => {
              form.setFieldsValue({ colorTag: color.toHexString() });
            }}
          />
        </Form.Item>
        <Form.Item label={<ListOrdered size={14} />} name="description">
          <Col span={24}>
            <ReactQuill
              theme="snow"
              placeholder="Thêm mô tả hoặc tệp đính kèm trên Google Drive"
              onChange={(value) => form.setFieldsValue({ description: value })}
              modules={modulesQuill}
              formats={formatsQuill}
              value={form.getFieldValue("description")}
              readOnly={!isEditing}
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
            {isEditMode ? "Cập nhật sự kiện" : "Thêm sự kiện"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddEventModal;
