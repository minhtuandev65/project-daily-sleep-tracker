import React from "react";
import { Link } from "react-router-dom";
import { Layout, Typography, Space } from "antd";
import {
  CheckCircleTwoTone,
  SmileTwoTone,
  ScheduleTwoTone,
  BulbTwoTone,
  HeartTwoTone,
  PlusOutlined,
} from "@ant-design/icons";
import ButtonCustom from "../../Components/ButtonCustom/ButtonCustom";

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

function SplashScreenPage() {
  return (
    <Layout className="bg-white min-h-screen px-[150px] py-[50px] max-md:px-5 max-md:py-[30px] max-sm:px-2 max-sm:py-[20px]">
      <Content>
        <Typography>
          <Title
            level={1}
            className="text-center font-bold mb-6"
            style={{
              fontSize: window.innerWidth <= 480 ? "28px" : undefined,
            }}
          >
            💤 Daily Sleep Tracker
          </Title>

          <Paragraph className="text-[20px] max-md:text-[16px] max-sm:text-[12px] mt-4">
            <Text
              strong
              className="text-[20px] max-md:text-[17px] max-sm:text-[13px]"
            >
              Daily Sleep Tracker
            </Text>{" "}
            is an application that helps users track, record and improve their
            sleep quality easily and effectively. The application is designed
            with a friendly interface, allowing users to record their sleep
            time, wake up time, total sleep time and feel about their sleep
            quality every day.
          </Paragraph>

          <Paragraph className="text-[20px] max-md:text-[16px] max-sm:text-[12px] mt-4">
            In modern life, quality sleep is one of the important factors that helps the body recover, improve the spirit and increase work performance. However, many people often ignore or do not pay attention to their sleeping habits.
            <Text
              strong
              className="text-[20px] max-md:text-[17px] max-sm:text-[13px]"
            >
              {" "}
              Daily Sleep Tracker{" "}
            </Text>{" "}
            helps users recognize sleep trends, thereby making appropriate adjustments to sleep better and live healthier.
          </Paragraph>

          <Title
            level={2}
            className="text-2xl mt-10 max-md:text-xl max-sm:text-[20px]"
          >
            🌞 How can the app help you?
          </Title>

          <Space
            direction="vertical"
            size="middle"
            className="text-[20px] max-md:text-[16px] max-sm:text-[12px] mt-4"
          >
            <Text>
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                className="mr-2 text-[20px]"
              />
              Tracker your sleep and wake up times every day.
            </Text>
            <Text>
              <ScheduleTwoTone
                twoToneColor="#1890ff"
                className="mr-2 text-[20px]"
              />
              Track total sleep time and sleep quality over time.
            </Text>
            <Text>
              <BulbTwoTone
                twoToneColor="#fadb14"
                className="mr-2 text-[20px]"
              />
              Add personal notes about your habits or how you feel after each sleep.
            </Text>
            <Text>
              <SmileTwoTone
                twoToneColor="#722ed1"
                className="mr-2 text-[20px]"
              />
              Review sleep history to detect recurring problems.
            </Text>
            <Text>
              <HeartTwoTone
                twoToneColor="#eb2f96"
                className="mr-2 text-[20px]"
              />
              Support users to form more scientific and regular sleeping habits.
            </Text>
          </Space>
        </Typography>

        <div className="w-[200px] mt-10 flex flex-col gap-2 max-md:w-full max-sm:w-full">
          <Title level={4} className="mb-2">
            Sleep records
          </Title>
          <div className="w-[150px]">
            <Link to={"/login"}>
              <ButtonCustom
                htmlType="submit"
                type="text"
                text={
                  <span className="flex items-center justify-center gap-2">
                    <PlusOutlined className="text-[18px] mr-1" />
                    New Entry
                  </span>
                }
                block
              />
            </Link>
          </div>
        </div>
      </Content>
    </Layout>
  );
}

export default SplashScreenPage;
