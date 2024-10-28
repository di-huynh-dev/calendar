import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  Row,
  TimePicker,
} from "antd";
import { FieldTimeOutlined } from "@ant-design/icons";
import { Timer } from "lucide-react";
import dayjs from "dayjs";

interface AddEventModalProps {
  selectedTime: Date | null;
  onClose: () => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({
  selectedTime,
  onClose,
}) => {
  const handleOk = () => {};

  const handleCancel = () => {
    onClose();
  };

  const [form] = Form.useForm();

  const onFinish = (values: any) => {};

  return (
    <Modal
      title="Thêm sự kiện mới"
      open={!!selectedTime}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      width={600}
      footer={null}
      maskClosable={true}
    >
      {/* {selectedTime && <p>Thời gian: {selectedTime.toLocaleString()}</p>} */}
      <Form
        form={form}
        name="events"
        onFinish={onFinish}
        colon={false}
        requiredMark={false}
        autoComplete="off"
        layout="horizontal"
      >
        <Form.Item
          name="title"
          className="border-b-2 hover:border-orange-500 w-full"
        >
          <Input
            placeholder="Thêm tiêu đề"
            size="large"
            bordered={false}
            className="text-xl"
          />
        </Form.Item>
        <Form.Item label={<Timer size={14} />}>
          <Row gutter={24}>
            <Col xs={24} sm={12}>
              <Form.Item
                name={["time", "date"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn ngày",
                  },
                ]}
              >
                <DatePicker
                  className="w-full"
                  format={"DD-MM-YYYY"}
                  defaultValue={dayjs()}
                  needConfirm={false}
                  disabledDate={(current) => current.isBefore(dayjs(), "day")}
                  onChange={(date) => {
                    form.setFieldsValue({ time: { startDate: date } });
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name={["time", "hour"]}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn giờ",
                  },
                ]}
              >
                <TimePicker.RangePicker
                  format={"hh:mm A"}
                  className="w-full"
                  defaultValue={
                    selectedTime
                      ? [
                          dayjs(selectedTime),
                          dayjs(selectedTime).add(1, "hour"),
                        ]
                      : undefined
                  }
                  needConfirm={false}
                  minuteStep={15}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        ,
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
