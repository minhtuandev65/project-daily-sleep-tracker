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
import "./SplashScreenPage.css";
import ButtonEntry from "../../Components/ButtonEntry/ButtonEntry";
const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

function SplashScreenPage() {
  return (
    <Layout className="page-container">
      <Content>
        <Typography level={2}>
          <Title className="title" level={1}>
            💤 Daily Sleep Tracker
          </Title>
          <Paragraph className="paragraph-text" style={{ fontSize: "20px" }}>
            <Text className="text" strong>
              Daily Sleep Tracker
            </Text>{" "}
            là một ứng dụng hỗ trợ người dùng theo dõi, ghi lại và cải thiện
            chất lượng giấc ngủ của mình một cách dễ dàng và hiệu quả. Ứng dụng
            được thiết kế với giao diện thân thiện, cho phép người dùng ghi nhận
            thời gian đi ngủ, thời gian thức dậy, tổng thời lượng ngủ và cảm
            nhận về chất lượng giấc ngủ mỗi ngày.
          </Paragraph>

          <Paragraph className="paragraph-text" style={{ fontSize: "20px" }}>
            Trong cuộc sống hiện đại, giấc ngủ chất lượng là một trong những yếu
            tố quan trọng giúp cơ thể phục hồi, cải thiện tinh thần và tăng hiệu
            suất làm việc. Tuy nhiên, nhiều người thường bỏ qua hoặc không để ý
            đến thói quen ngủ của mình.
            <Text strong className="text">
              {" "}
              Daily Sleep Tracker{" "}
            </Text>{" "}
            giúp người dùng nhận ra các xu hướng trong giấc ngủ, từ đó đưa ra
            điều chỉnh phù hợp để ngủ ngon hơn và sống khỏe mạnh hơn.
          </Paragraph>

          <Title className="title" level={2} style={{ marginTop: 40 }}>
            🌞 Ứng dụng giúp gì cho bạn?
          </Title>

          <Space
            className="feature-text"
            direction="vertical"
            size="middle"
            style={{ fontSize: 20 }}
          >
            <Text>
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                style={{ fontSize: "20px" }}
              />{" "}
              Ghi lại thời gian ngủ và thức dậy mỗi ngày.
            </Text>
            <Text>
              <ScheduleTwoTone
                twoToneColor="#1890ff"
                style={{ fontSize: "20px" }}
              />{" "}
              Theo dõi tổng thời gian ngủ và chất lượng giấc ngủ theo thời gian.
            </Text>
            <Text>
              <BulbTwoTone
                twoToneColor="#fadb14"
                style={{ fontSize: "20px" }}
              />{" "}
              Thêm ghi chú cá nhân về thói quen hoặc cảm giác sau mỗi giấc ngủ.
            </Text>
            <Text>
              <SmileTwoTone
                twoToneColor="#722ed1"
                style={{ fontSize: "20px" }}
              />{" "}
              Nhìn lại lịch sử giấc ngủ để phát hiện các vấn đề lặp lại.
            </Text>
            <Text>
              <HeartTwoTone
                twoToneColor="#eb2f96"
                style={{ fontSize: "20px" }}
              />{" "}
              Hỗ trợ người dùng hình thành thói quen ngủ khoa học, đều đặn hơn.
            </Text>
          </Space>
        </Typography>
        <div
          className="entry-section"
          style={{
            width: 200,
            marginTop: 40,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <Title level={4} style={{ marginBottom: 8 }}>
            Bản ghi giấc ngủ
          </Title>
          <Link to={"/login"}>
            <ButtonEntry
              htmlType="submit"
              type="text"
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
              block
            />
          </Link>
        </div>
      </Content>
    </Layout>
  );
}

export default SplashScreenPage;
