import React, { useState, useContext } from "react";
import { Modal, DatePicker, Button, Row, Col } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import UserContext from "../../../../Context/UserContext";
import { createNewSleepRecordsAction } from "../../../../Redux/Actions/UsersAction/SleepRecordsAction/SleepRecordsAction";
import "./ModelEntry.css";
function ModelEntry({ visible, onClose }) {
  const { userId } = useContext(UserContext);
  const dispatch = useDispatch();

  const [sleepTime, setSleepTime] = useState(null);
  const [wakeTime, setWakeTime] = useState(null);

  const handleSubmit = () => {
    if (!sleepTime || !wakeTime) {
      return alert("Vui lòng chọn thời gian ngủ và thức dậy");
    }
    if (!userId) {
      return alert("User chưa đăng nhập");
    }
    const sleep = dayjs(sleepTime);
    const wake = dayjs(wakeTime);
    const data = {
      userId,
      sleepTime: new Date(sleep),
      wakeTime: new Date(wake),
      dateSleep: sleep.format("YYYY-MM-DD"),
      dateWake: wake.format("YYYY-MM-DD"),
    };
    dispatch(createNewSleepRecordsAction(data));
    onClose();
  };

  const handleReset = () => {
    setSleepTime(null);
    setWakeTime(null);
  };

  return (
    <Modal
      title="Nhập thông tin giấc ngủ"
      open={visible}
      onCancel={onClose}
      footer={
        <Row justify="space-between" style={{ width: "100%" }}>
          <Col>
            <Button type="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Col>
          <Col>
            <Button style={{ marginRight: 8 }} onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </Col>
        </Row>
      }
    >
      <div style={{ marginBottom: 16 }}>
        <label>Thời gian đi ngủ:</label>
        <DatePicker
          className="ant-picker-datetime-panel "
          getPopupContainer={(trigger) => trigger.parentNode}
          showTime
          format="YYYY-MM-DD HH:mm"
          value={sleepTime ? dayjs(sleepTime) : null}
          onChange={(value) => setSleepTime(value)}
          style={{ width: "100%" }}
          inputFontSizeSM
        />
      </div>
      <div>
        <label>Thời gian thức dậy:</label>
        <DatePicker
          className="ant-picker-datetime-panel "
          getPopupContainer={(trigger) => trigger.parentNode}
          showTime
          format="YYYY-MM-DD HH:mm"
          value={wakeTime ? dayjs(wakeTime) : null}
          onChange={(value) => setWakeTime(value)}
          style={{ width: "100%" }}
        />
      </div>
    </Modal>
  );
}

export default ModelEntry;
