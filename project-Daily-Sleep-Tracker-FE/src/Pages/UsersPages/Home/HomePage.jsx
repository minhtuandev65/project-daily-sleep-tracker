import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import ModelEntry from "./ModelEntry/ModelEntry";
import ButtonEntry from "../../../Components/ButtonEntry/ButtonEntry";
import { Layout, Typography, Row, Col, Button, Space } from "antd";
import ChartSleepRecords from "./ChartSleepRecords/ChartSleepRecords"; // import đúng đường dẫn
import "./HomePage.css";
import SleepStats from "./SleepStats/SleepStats";
import ButtonCustom from "../../../Components/ButtonCustom/ButtonCustom";

const { Title } = Typography;
const { Content } = Layout;

function HomePageUser() {
  const [modalVisible, setModalVisible] = useState(false);
  const [days, setDays] = useState(7); // Mặc định chọn 7 ngày

  return (
    <Layout className="container" style={{ minHeight: "100vh", padding: 24 }}>
      <Content>
        <Title className="title" level={1}>
          💤 Daily Sleep Tracker
        </Title>

        <Space className="entry-section" style={{ marginBottom: 16 }}>
          <div
            style={{
              width: "200px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ButtonEntry
              htmlType="submit"
              type="text"
              onClick={() => setModalVisible(true)}
              className="btnEntry"
              style={{
                width: 200,
              }}
              text={
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <PlusOutlined style={{ fontSize: 18, marginRight: 4 }} />
                  Entry
                </span>
              }
            />
          </div>
        </Space>

        {/* Nút chọn 7 days hoặc 30 days */}
        <Space className="entry-section" style={{ marginBottom: 24 }}>
          <ButtonCustom
            type={days === 7 ? "default" : "default"}
            onClick={() => setDays(7)}
            text="Last 7 days"
            className={days === 7 ? "btnCustom active" : "btnCustom"}
          />

          <ButtonCustom
            type={days === 30 ? "default" : "default"}
            onClick={() => setDays(30)}
            text="Last 30 days"
            className={days === 30 ? "btnCustom active" : "btnCustom"}
          />
        </Space>

        <Row gutter={24}>
          <Col
            xs={24}
            md={12}
            className="sleep-chart-box"
            style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}
          >
            <h3>Sleep Duration</h3>
            <ChartSleepRecords days={days} />
          </Col>

          <Col
            xs={24}
            md={12}
            className="sleep-chart-box"
            style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}
          >
            <h3>Sleep Stats</h3>
            <SleepStats days={days} />
          </Col>
        </Row>

        <ModelEntry
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </Content>
    </Layout>
  );
}

export default HomePageUser;
