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
            là một ứng dụng hỗ trợ người dùng theo dõi, ghi lại và cải thiện
            chất lượng giấc ngủ của mình một cách dễ dàng và hiệu quả. Ứng dụng
            được thiết kế với giao diện thân thiện, cho phép người dùng ghi nhận
            thời gian đi ngủ, thời gian thức dậy, tổng thời lượng ngủ và cảm
            nhận về chất lượng giấc ngủ mỗi ngày.
          </Paragraph>

          <Paragraph className="text-[20px] max-md:text-[16px] max-sm:text-[12px] mt-4">
            Trong cuộc sống hiện đại, giấc ngủ chất lượng là một trong những yếu
            tố quan trọng giúp cơ thể phục hồi, cải thiện tinh thần và tăng hiệu
            suất làm việc. Tuy nhiên, nhiều người thường bỏ qua hoặc không để ý
            đến thói quen ngủ của mình.
            <Text
              strong
              className="text-[20px] max-md:text-[17px] max-sm:text-[13px]"
            >
              {" "}
              Daily Sleep Tracker{" "}
            </Text>{" "}
            giúp người dùng nhận ra các xu hướng trong giấc ngủ, từ đó đưa ra
            điều chỉnh phù hợp để ngủ ngon hơn và sống khỏe mạnh hơn.
          </Paragraph>

          <Title
            level={2}
            className="text-2xl mt-10 max-md:text-xl max-sm:text-[20px]"
          >
            🌞 Ứng dụng giúp gì cho bạn?
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
              Ghi lại thời gian ngủ và thức dậy mỗi ngày.
            </Text>
            <Text>
              <ScheduleTwoTone
                twoToneColor="#1890ff"
                className="mr-2 text-[20px]"
              />
              Theo dõi tổng thời gian ngủ và chất lượng giấc ngủ theo thời gian.
            </Text>
            <Text>
              <BulbTwoTone
                twoToneColor="#fadb14"
                className="mr-2 text-[20px]"
              />
              Thêm ghi chú cá nhân về thói quen hoặc cảm giác sau mỗi giấc ngủ.
            </Text>
            <Text>
              <SmileTwoTone
                twoToneColor="#722ed1"
                className="mr-2 text-[20px]"
              />
              Nhìn lại lịch sử giấc ngủ để phát hiện các vấn đề lặp lại.
            </Text>
            <Text>
              <HeartTwoTone
                twoToneColor="#eb2f96"
                className="mr-2 text-[20px]"
              />
              Hỗ trợ người dùng hình thành thói quen ngủ khoa học, đều đặn hơn.
            </Text>
          </Space>
        </Typography>

        <div className="w-[200px] mt-10 flex flex-col gap-2 max-md:w-full max-sm:w-full">
          <Title level={4} className="mb-2">
            Bản ghi giấc ngủ
          </Title>
          <div className="w-[150px]">
            <Link to={"/login"}>
              <ButtonCustom
                htmlType="submit"
                type="text"
                text={
                  <span className="flex items-center justify-center gap-2">
                    <PlusOutlined className="text-[18px] mr-1" />
                    Entry
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
