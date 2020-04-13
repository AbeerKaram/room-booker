/* eslint-disable no-underscore-dangle */
import {
  AutoComplete,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Switch,
  TimePicker,
} from 'antd';
import moment from 'moment';
import React from 'react';
import ThemeContext from './Context';
import './style.css';

const { Option } = AutoComplete;
const BookingForm = () => {
  const [form] = Form.useForm();
  const disabledDate = (current) => current && current < moment().endOf('day');
  return (
    <ThemeContext.Consumer>
      {({
        visible,
        handleCancel,
        desc,
        title,
        titleOnChange,
        descOnChange,
        selectedRoom,
        repeat,
        repeatOnChange,
        remindMeOnChange,
        arraydat,
        bookRoom,
        rooms,
        ourData,
        timeOnChange,
        setRoom,
        handleSearch,
        dateROnChange,
        dateOnChange,
        remind,
        confirmLoading,
        ourRooms,
      }) => (
        <Modal
          title="Reserve Your Room"
          visible={visible}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText="Reserve Room"
          cancelText="Cancel"
          okButtonProps={{ disabled: ourData.length > 0 }}
          onOk={() => {
            form
              .validateFields()
              .then(() => {
                form.resetFields();
                bookRoom(selectedRoom, rooms, title, desc, arraydat, remind);
              })
              .catch((info) => {
                console.log('Validate Failed:', info);
              });
          }}
        >
          <Form form={form}>
            <Form.Item
              name="name"
              label="Space(s):"
              rules={[{ required: true, message: 'Choose your space' }]}
            >
              <AutoComplete
                style={{
                  width: 200,
                }}
                disabled={ourData.length > 0}
                initialValues={
                  ourData.length > 0
                    ? ourRooms.filter((e) => e.id === ourData[0].room_id)[0]
                        .name
                    : ''
                }
                onSelect={setRoom}
                onSearch={handleSearch}
                placeholder="Room Name"
                value={selectedRoom}
              >
                {rooms.map((room) => (
                  <Option key={room.id} value={room.name}>
                    {room.name}
                  </Option>
                ))}
              </AutoComplete>
            </Form.Item>

            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Add Your Title' }]}
            >
              <Input
                value={title}
                disabled={ourData.length > 0}
                onChange={titleOnChange}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Add decription' }]}
            >
              <Input.TextArea
                value={desc}
                disabled={ourData.length > 0}
                onChange={descOnChange}
              />
            </Form.Item>

            <Form.Item
              name="repeat"
              label="Repeat"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Radio.Group
                value={repeat}
                onChange={repeatOnChange}
                disabled={ourData.length > 0}
              >
                <Radio.Button value="once">Once</Radio.Button>
                <Radio.Button value="daily">Daily</Radio.Button>
                <Radio.Button value="weekly">Weekly</Radio.Button>
              </Radio.Group>
            </Form.Item>

            {repeat === 'once' && (
              <Form.Item
                name="date"
                label="Day "
                rules={[
                  {
                    required: true,
                    message: 'Choose your date',
                  },
                ]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  disabledDate={disabledDate}
                  onChange={dateOnChange}
                  disabled={ourData.length > 0}
                  initialValues={
                    ourData.length > 0 &&
                    moment(ourData[0].start_time.split('T')[0])
                  }
                />
              </Form.Item>
            )}

            {repeat !== 'once' && (
              <Form.Item
                name="daterange"
                label="Day "
                rules={[
                  {
                    required: true,
                    message: 'Choose your date',
                  },
                ]}
              >
                <DatePicker.RangePicker
                  onChange={dateROnChange}
                  disabledDate={disabledDate}
                />
              </Form.Item>
            )}

            <Form.Item
              name="time"
              label=" Time"
              rules={[
                {
                  required: true,
                  message: 'Choose your time',
                },
              ]}
            >
              <TimePicker.RangePicker
                disabled={ourData.length > 0}
                defaultValue={
                  ourData.length > 0 && [
                    moment(ourData[0].start_time.split('T')[1], 'HH:mm:ss'),
                    moment(ourData[0].end_time.split('T')[1], 'HH:mm:ss'),
                  ]
                }
                onChange={timeOnChange}
              />
            </Form.Item>

            <Form.Item>
              Remind me
              <Switch
                disabled={ourData.length > 0}
                defaultChecked
                onChange={remindMeOnChange}
              />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </ThemeContext.Consumer>
  );
};

export default BookingForm;
