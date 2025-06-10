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
function SleepTrackerModal({
  visible,
  onClose,
  trackerId,
  initialValues,
  existingTrackers = [],
}) {
  const dispatch = useDispatch();
  const [sleepTime, setSleepTime] = useState(null);
  const [wakeTime, setWakeTime] = useState(null);
  useEffect(() => {
    if (initialValues) {
      setSleepTime(dayjs(initialValues.sleepTime));
      setWakeTime(dayjs(initialValues.wakeTime));
    }
  }, [initialValues]);
  console.log(existingTrackers)
  const handleSubmit = () => {
    if (!sleepTime || !wakeTime) {
      notificationFunction(
        "error",
        "Please enter full sleep time and wake-up time.",
        "Error"
      );
      return;
    }
    const now = dayjs();
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
    if (sleep.isAfter(now) || wake.isAfter(now)) {
      notificationFunction(
        "error",
        "Sleep time and wake-up time cannot be in the future.",
        "Invalid Time"
      );
      return;
    }

    const duration = wake.diff(sleep, "hour", true);
    if (duration > 24) {
      notificationFunction(
        "error",
        "Sleep duration cannot exceed 24 hours.",
        "Too Long"
      );
      return;
    }

    // Kiểm tra trùng thời gian với các bản ghi cũ (nếu có truyền existingTrackers vào)
    const dataExistingTrackers = existingTrackers.sleepTrackers;
    console.log("dataExistingTrackers", dataExistingTrackers);
    if (existingTrackers && existingTrackers.length > 0) {
      const isOverlapping = existingTrackers.some((tracker) => {
        // Nếu đang update thì bỏ qua bản ghi hiện tại
        if (trackerId && tracker._id === trackerId) return false;

        const existingSleep = dayjs(tracker.sleepTime);
        const existingWake = dayjs(tracker.wakeTime);

        // Cùng ngày
        const sameDay =
          sleep.isSame(existingSleep, "day") ||
          wake.isSame(existingWake, "day");

        // Kiểm tra trùng thời điểm (ngủ hoặc thức)
        return (
          sameDay &&
          (sleep.isSame(existingSleep) ||
            sleep.isSame(existingWake) ||
            wake.isSame(existingSleep) ||
            wake.isSame(existingWake))
        );
      });
      console.log("isOverlapping", isOverlapping);
      if (isOverlapping) {
        notificationFunction(
          "error",
          "Sleep or wake-up time overlaps with an existing tracker on the same day.",
          "Time Conflict"
        );
        return;
      }
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
          disabledDate={(current) => current && current > dayjs().endOf("day")}
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
          disabledDate={(current) => current && current > dayjs().endOf("day")}
        />
      </div>
    </Modal>
  );
}

export default SleepTrackerModal;
