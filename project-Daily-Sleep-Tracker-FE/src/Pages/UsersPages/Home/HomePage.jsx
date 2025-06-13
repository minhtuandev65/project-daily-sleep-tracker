import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import SleepTrackerModal from "./SleepTrackerModal/SleepTrackerModal";
import { Layout, Typography, Row, Col, Space } from "antd";
import SleepStats from "./SleepStats/SleepStats";
import ButtonCustom from "../../../Components/ButtonCustom/ButtonCustom";
import SleepDurationChartArea from "./ChartSleepTrackers/SleepDurationChartArea/SleepDurationChartArea";
import SleepTImeChartBar from "./ChartSleepTrackers/SleepTImeChartBar/SleepTImeChartBar";
import { useDispatch, useSelector } from "react-redux";
import {
  getSleepTrackersByDaysAction,
  getSleepTrackersByUserIdAction,
} from "../../../Redux/Actions/UsersAction/SleepTrackersAction/SleepTrackersAction";

const { Title } = Typography;
const { Content } = Layout;

function HomePageUser() {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [days, setDays] = useState(7);
  const [chartType, setChartType] = useState("duration");
  const { sleepTrackersByDays, sleepTrackersByUserId } = useSelector(
    (state) => state.SleepTrackersReducer
  );

  useEffect(() => {
    if (days) {
      const rangeStr = days === 7 ? "7days" : "30days";
      dispatch(getSleepTrackersByDaysAction(rangeStr));
    }
  }, [dispatch, days]);

  useEffect(() => {
    if (modalVisible) {
      if (!sleepTrackersByUserId || sleepTrackersByUserId.length === 0) {
        dispatch(getSleepTrackersByUserIdAction());
      }
    }
  }, [modalVisible, dispatch]);

  return (
    <Layout className="bg-white min-h-screen px-6 md:px-[150px] py-[50px]">
      <Content>
        <Title
          level={1}
          className="text-center font-bold mb-6"
          style={{
            fontSize: window.innerWidth <= 480 ? "28px" : undefined,
          }}
        >
          💤 Daily Sleep Tracker
        </Title>

        {/* Entry button */}
        <div className="flex justify-center mb-4">
          <div className="w-[200px] flex justify-center">
            <ButtonCustom
              htmlType="submit"
              type="text"
              onClick={() => setModalVisible(true)}
              className="w-full"
              text={
                <span className="flex items-center justify-center gap-2">
                  <PlusOutlined className="text-lg" />
                  New Entry
                </span>
              }
            />
          </div>
        </div>

        {/* Chọn số ngày */}
        <div className="flex justify-center mb-6 gap-4">
          <div className="w-full max-w-[150px]">
            <ButtonCustom
              type="default"
              onClick={() => setDays(7)}
              text="Last 7 days"
              className={`btnCustom w-full ${days === 7 ? "active" : ""}`}
            />
          </div>

          <div className="w-full max-w-[150px]">
            <ButtonCustom
              type="default"
              onClick={() => setDays(30)}
              text="Last 30 days"
              className={`btnCustom w-full ${days === 30 ? "active" : ""}`}
            />
          </div>
        </div>

        {/* Biểu đồ và thống kê */}

        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <div className="border border-gray-300 p-4 rounded-lg md:p-6">
              <div className="flex justify-center gap-4 my-4 w-full max-w-[350px] mx-auto">
                <ButtonCustom
                  type="default"
                  onClick={() => setChartType("duration")}
                  text="Sleep Duration"
                  className={`btnCustom ${
                    chartType === "duration" ? "active" : ""
                  }`}
                />
                <ButtonCustom
                  type="default"
                  onClick={() => setChartType("time")}
                  text="Sleep Time"
                  className={`btnCustom ${
                    chartType === "time" ? "active" : ""
                  }`}
                />
              </div>
              <Title level={3} className="!mb-2">
                {chartType === "duration" ? "Sleep Duration" : "Sleep Time"}
              </Title>
              {chartType === "duration" ? (
                <SleepDurationChartArea
                  data={sleepTrackersByDays}
                  days={days}
                />
              ) : (
                <SleepTImeChartBar data={sleepTrackersByDays} />
              )}
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div className="border border-gray-300 p-4 rounded-lg md:p-6">
              <Title level={3} className="!mb-2">
                Sleep Stats
              </Title>
              <SleepStats days={days} data={sleepTrackersByDays} />
            </div>
          </Col>
        </Row>
        {/* Modal nhập giấc ngủ */}
        <SleepTrackerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          existingTrackers={sleepTrackersByUserId}
          days={days}
        />
      </Content>
    </Layout>
  );
}

export default HomePageUser;
