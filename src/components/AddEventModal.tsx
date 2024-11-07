import { Button, Checkbox, Col, ColorPicker, DatePicker, Form, Input, Modal, Popconfirm, Row, Select, TimePicker, Tooltip } from 'antd'
import { ListOrdered, MapPin, Palette, Timer, Trash, Undo2, Users, X } from 'lucide-react'
import GoogleMeetIcon from '../assets/meet.png'
import dayjs from 'dayjs'
import cities from '../data/city.json'
import wards from '../data/ward.json'
import districts from '../data/district.json'
import persons from '../data/person.json'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useCalendarStore } from '../store/useCalendarStore'
import toast from 'react-hot-toast'
import { useEffect, useRef, useState } from 'react'
import useReactQuill from '../hooks/useReactQuill'

type SelectedTime = {
  start: Date
  end: Date
}

interface AddEventModalProps {
  selectedTime: SelectedTime | null
  onClose: () => void
  selectedEvent: any
}

const AddEventModal: React.FC<AddEventModalProps> = ({ selectedTime, selectedEvent, onClose }) => {
  const { addEvent, removeEvent, updateEvent } = useCalendarStore()
  const isEditMode = Boolean(selectedEvent)
  const [isEditing, setIsEditing] = useState(!isEditMode)
  const { modules, formats } = useReactQuill()
  const quillRef = useRef<ReactQuill>(null)

  const [form] = Form.useForm()

  useEffect(() => {
    if (isEditMode && selectedEvent) {
      form.setFieldsValue({
        title: selectedEvent.title,
        time: {
          range: [dayjs(selectedEvent.start), dayjs(selectedEvent.end)],
        },
        googleMeetLink: selectedEvent.googleMeetLink,
        location: selectedEvent.location,
        participants: selectedEvent.participants,
        description: selectedEvent.description,
        colorTag: selectedEvent.colorTag,
        allDay: selectedEvent.allDay,
      })
    } else {
      form.setFieldsValue({
        time: {
          range: selectedTime ? [dayjs(selectedTime.start), dayjs(selectedTime.end)] : undefined,
        },
        description: '',
      })
    }
  }, [selectedEvent, selectedTime, form, isEditMode])

  const selectedCity = Form.useWatch(['location', 'city'], form)
  const selectedDistrict = Form.useWatch(['location', 'district'], form)
  const selectedWard = Form.useWatch(['location', 'ward'], form)

  const onFinish = (values: any) => {
    const { title, time, googleMeetLink, location, participants, description, colorTag, allDay } = values

    const startTime = dayjs(time.range[0])
    const endTime = dayjs(time.range[1])

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
      allDay,
    }

    if (isEditMode) {
      updateEvent(event)
      toast.success('Sự kiện đã được cập nhật')
    } else {
      addEvent(event)
      toast.success('Sự kiện đã được thêm thành công')
    }

    form.resetFields()
    onClose()
  }
  const handleCancel = () => {
    onClose()
  }

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      removeEvent(selectedEvent.id)
      onClose()
      toast.success('Sự kiện đã được xóa thành công')
    }
  }

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <p className="font-bold">{isEditMode ? 'Chi tiết sự kiện' : 'Thêm sự kiện mới'}</p>
          <div className="flex gap-4 items-center">
            {isEditMode && (
              <>
                {isEditing ? (
                  <Tooltip title="Hủy chỉnh sửa">
                    <Popconfirm
                      title="Xác nhận hủy thay đổi"
                      onConfirm={() => {
                        setIsEditing(false)
                      }}
                    >
                      <button>
                        <Undo2 size={16} />
                      </button>
                    </Popconfirm>
                  </Tooltip>
                ) : (
                  <>
                    <Tooltip title="Xóa sự kiện">
                      <Popconfirm title="Xác nhận Xóa sự kiện" onConfirm={handleDeleteEvent}>
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
      maskClosable={true}
      closable={false}
      footer={
        <Button type="primary" htmlType="submit" className="w-full mt-4" onClick={() => form.submit()}>
          {isEditMode ? 'Cập nhật sự kiện' : 'Thêm sự kiện'}
        </Button>
      }
    >
      <Form
        form={form}
        name="events"
        onFinish={onFinish}
        colon={false}
        requiredMark={false}
        autoComplete="off"
        layout="horizontal"
        className="max-h-[calc(100vh-200px)] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-w-1]"
      >
        {/* Title */}
        <Form.Item
          name="title"
          className={`w-full ml-6 border-b-[1px] ${isEditing ? ' hover:border-blue-500' : ''}`}
          rules={[{ max: 100, message: 'Tiêu đề qúa dài' }]}
        >
          <Input placeholder="Thêm tiêu đề" size="large" variant="borderless" className="text-xl" />
        </Form.Item>

        {/* Participants */}
        <Form.Item label={<Users size={14} />} className="mb-0">
          <Form.Item name="participants">
            <Select
              placeholder="Người tham gia"
              showSearch
              allowClear
              mode="multiple"
              tagRender={() => <></>}
              filterOption={(input: string, option: any) => {
                return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }}
              onChange={(value) => {
                form.setFieldsValue({ participants: value })
              }}
            >
              {Object.values(persons).map((person) => (
                <Select.Option key={person.id} value={person.id}>
                  <div className="flex items-center">
                    <img src={person.avatar} alt={person.name} className="w-6 h-6 object-cover rounded-full mr-2" />
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
              const selectedParticipants = getFieldValue('participants') || []
              return (
                <div className="mt-2 grid grid-cols-2">
                  {selectedParticipants.map((id: string) => {
                    const person = persons.find((p) => p.id === Number(id))
                    return (
                      <div key={id} className="grid grid-cols-8 gap-x-1 gap-y-2 items-center">
                        <img src={person?.avatar} alt={person?.name} className="col-span-1 w-6 h-6 object-cover rounded-full" />
                        <div className="col-span-6">
                          <p>{person?.name}</p>
                          <p>{person?.email}</p>
                        </div>
                        <X
                          size={16}
                          className="col-span-1 cursor-pointer ml-2"
                          onClick={() => {
                            const newParticipants = selectedParticipants.filter((p: string) => p !== id)
                            form.setFieldsValue({
                              participants: newParticipants,
                            })
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              )
            }}
          </Form.Item>
        </Form.Item>

        {/* Time events */}
        <Form.Item label={<Timer size={14} />} className="mb-0">
          <Row gutter={24}>
            <Col xs={24} sm={18}>
              <Form.Item
                name={['time', 'range']}
                rules={[
                  {
                    type: 'array',
                    required: true,
                    message: 'Vui lòng chọn thời gian',
                  },
                  {
                    validator: (_, value) => {
                      if (value && value[0] && value[1] && value[0].isSame(value[1])) {
                        return Promise.reject(new Error('Thời gian sự kiện không phù hợp!'))
                      }
                      return Promise.resolve()
                    },
                  },
                ]}
              >
                <DatePicker.RangePicker
                  className="w-full"
                  format={'DD-MM-YYYY HH:mm'}
                  showTime={{ format: 'HH:mm', minuteStep: 15 }}
                  value={form.getFieldValue(['time', 'range'])}
                  onChange={(dates) => {
                    form.setFieldsValue({ time: { range: dates } })
                    form.setFieldValue('allDay', '')
                  }}
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={6}>
              <Form.Item name="allDay" valuePropName="checked">
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      const range = form.getFieldValue(['time', 'range']) || [dayjs(), dayjs().add(1, 'hour')]
                      form.setFieldsValue({
                        time: {
                          range: [range[0].startOf('day'), range[0].endOf('day')],
                        },
                      })
                    } else {
                      const initialRange = selectedTime
                        ? [dayjs(selectedTime.start), dayjs(selectedTime.end)]
                        : [dayjs(), dayjs().add(1, 'hour')]
                      form.setFieldsValue({
                        time: {
                          range: initialRange,
                        },
                      })
                    }
                  }}
                >
                  Cả ngày
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>

        {/* Google meet link */}
        <Form.Item label={<img src={GoogleMeetIcon} alt="GG meet icon" className="w-4 h-4 mr-2 mt-2" />} className="mb-0">
          <Form.Item
            name="googleMeetLink"
            className={`w-full border-b-[1px] ${isEditing ? 'hover:border-blue-500' : ''}`}
            rules={[
              {
                type: 'url',
                message: 'Liên kết không hợp lệ',
              },
            ]}
          >
            <Input placeholder="Thêm liên kết Google Meet" variant="borderless" />
          </Form.Item>
        </Form.Item>

        {/* Location */}
        <Form.Item label={<MapPin size={14} className="mb-0" />}>
          <Row gutter={24}>
            <Col xs={24} sm={24}>
              <Form.Item name={['location', 'city']}>
                <Select
                  placeholder="Thành phố"
                  showSearch
                  allowClear
                  filterOption={(input, option) => {
                    return option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
                  }}
                  onChange={(value) => {
                    form.setFieldsValue({
                      location: {
                        city: value,
                        district: undefined,
                        ward: undefined,
                      },
                    })
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
              <Form.Item name={['location', 'district']}>
                <Select
                  placeholder="Quận/huyện"
                  showSearch
                  allowClear
                  filterOption={(input, option) => option?.children?.toString().toLowerCase().includes(input.toLowerCase()) || false}
                  onChange={(value) => {
                    form.setFieldsValue({
                      location: {
                        ...form.getFieldValue('location'),
                        district: value,
                        ward: undefined,
                      },
                    })
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
              <Form.Item name={['location', 'ward']}>
                <Select
                  placeholder="Phường/xã"
                  showSearch
                  allowClear
                  filterOption={(input, option) => {
                    return option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
                  }}
                  onChange={(value) => {
                    form.setFieldsValue({
                      location: {
                        ...form.getFieldValue('location'),
                        ward: value,
                      },
                    })
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
            <Form.Item className={`w-full border-b-[1px] mb-0 ${isEditing ? ' hover:border-blue-500' : ''}`} name={['location', 'address']}>
              <Input placeholder="Địa chỉ cụ thể" variant="borderless" disabled={!selectedDistrict || !selectedCity || !selectedWard} />
            </Form.Item>
          </Row>
        </Form.Item>

        {/* Color event */}
        <Form.Item label={<Palette size={14} />} name="colorTag">
          <Tooltip title="Màu sắc sự kiện">
            <ColorPicker
              allowClear
              showText
              onChange={(color) => {
                form.setFieldsValue({ colorTag: color.toHexString() })
              }}
            />
          </Tooltip>
        </Form.Item>

        {/* Description */}
        <Form.Item label={<ListOrdered size={14} />} name="description" className="mb-0">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            placeholder="Thêm mô tả hoặc tệp đính kèm trên Google Drive"
            onChange={(value) => form.setFieldsValue({ description: value })}
            modules={modules}
            formats={formats}
            value={form.getFieldValue('description')}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddEventModal
