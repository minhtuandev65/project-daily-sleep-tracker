import React, { useEffect, useState } from "react";
import { Modal, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import {
  createNewSleepTrackersAction,
  updateSleepTrackerAction,
} from "../../../../Redux/Actions/UsersAction/SleepTrackersAction/SleepTrackersAction";
import "./SleepTrackerModal.css";
import ButtonCustom from "../../../../Components/ButtonCustom/ButtonCustom";
import { notificationFunction } from "../../../../Utils/libs/Notification";
function SleepTrackerModal({ visible, onClose, trackerId, initialValues }) {
  const dispatch = useDispatch();
  const [sleepTime, setSleepTime] = useState(null);
  const [wakeTime, setWakeTime] = useState(null);
  useEffect(() => {
    if (initialValues) {
      setSleepTime(dayjs(initialValues.sleepTime));
      setWakeTime(dayjs(initialValues.wakeTime));
    }
  }, [initialValues]);

  const handleSubmit = () => {
    if (!sleepTime || !wakeTime) {
      notificationFunction(
        "error",
        "Please enter full sleep time and wake-up time.",
        "Error"
      );
      return;
    }

    const sleep = dayjs(sleepTime);
    const wake = dayjs(wakeTime);
    if (sleep.isAfter(wake) || sleep.isSame(wake)) {
      notificationFunction(
        "error",
        "Sleep time should be before wake-up time.",
        "Error"
      );
      return;
    }

    const data = {
      sleepTime: dayjs(sleepTime).toISOString(),
      wakeTime: dayjs(wakeTime).toISOString(),
    };
    if (trackerId) {
      dispatch(updateSleepTrackerAction(trackerId, data));
    } else {
      dispatch(createNewSleepTrackersAction(data));
    }
    onClose();
  };

  const handleReset = () => {
    setSleepTime(null);
    setWakeTime(null);
  };

  return (
    <Modal
      title="Enter information sleep"
      open={visible}
      onCancel={onClose}
      footer={
        <div className="w-full flex flex-col sm:flex-row justify-between gap-2">
          <ButtonCustom text="Submit" type="primary" onClick={handleSubmit} />
          <div className="flex gap-2 justify-end">
            <Button
              className="h-[50px] w-[80px]"
              type="primary"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button className="h-[50px] w-[80px]" danger onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      }
    >
      <div className="mb-4">
        <label className="block mb-1 font-medium">Sleep time:</label>
        <DatePicker
          className="w-full custom-datepicker"
          showTime
          format="YYYY-MM-DD HH:mm"
          value={sleepTime ? dayjs(sleepTime) : null}
          onChange={(value) => setSleepTime(value)}
          getPopupContainer={(trigger) => trigger.parentNode}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Wake-up time:</label>
        <DatePicker
          className="w-full custom-datepicker"
          showTime
          format="YYYY-MM-DD HH:mm"
          value={wakeTime ? dayjs(wakeTime) : null}
          onChange={(value) => setWakeTime(value)}
          getPopupContainer={(trigger) => trigger.parentNode}
        />
      </div>
    </Modal>
  );
}

export default SleepTrackerModal;
