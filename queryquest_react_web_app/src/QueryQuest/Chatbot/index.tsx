import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as client from "../APIs/chatbotAPI";
import {
  CoffeeOutlined,
  FireOutlined,
  SmileOutlined,
  UserOutlined,
  TeamOutlined,
  TrophyOutlined,
  BookOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { Bubble, Prompts, PromptsProps, Sender } from "@ant-design/x";
import {
  App,
  Flex,
  Radio,
  RadioChangeEvent,
  Typography,
  message,
  Card,
} from "antd";

const { Title, Text } = Typography;

const studentItems = [
  {
    key: "1",
    icon: <CoffeeOutlined style={{ color: "#964B00" }} />,
    description: "My current total points",
    callback: async (userId: number) => {
      const data = await client.getStudentPoints(userId);
      const sql = data.generated_sql;
      const res = `You gained ${data.total_points} points in all.`;
      return { sql, res };
    },
  },
  {
    key: "2",
    icon: <SmileOutlined style={{ color: "#FAAD14" }} />,
    description: "My current rank",
    callback: async (userId: number) => {
      const data = await client.getStudentRankingWithPosition(userId);
      const sql = data.generated_sql;
      const res = `You are ranked ${data.ranking_position} in all the students.`;
      return { sql, res };
    },
  },
  {
    key: "3",
    icon: <FireOutlined style={{ color: "#FF4D4F" }} />,
    description: "Questions I've answered incorrectly before",
    callback: async (userId: number) => {
      const data = await client.getStudentWrongProblems(userId);
      const sql = data.generated_sql;
      const res = data.wrong_problem_ids.length
        ? `You previously answered these questions incorrectly: ${data.wrong_problem_ids
            .map((p: any) => `#${p}`)
            .join(", ")}.`
        : "You haven't answered any questions incorrectly!";
      return { sql, res };
    },
  },
];

const instructorItems = [
  {
    key: "4",
    icon: <TrophyOutlined style={{ color: "#FFD700" }} />,
    description: "Names of the top 5 highest scorers",
    callback: async (userId: number) => {
      // Temporary SQL and response for the callback
      const sql = "SELECT "; // Placeholder SQL
      const res = "You ."; // Placeholder response
      return { sql, res };
    },
  },
  {
    key: "5",
    icon: <TeamOutlined style={{ color: "#1890FF" }} />,
    description: "Current number of students",
    callback: async (userId: number) => {
      // Temporary SQL and response for the callback
      const sql = "SELECT "; // Placeholder SQL
      const res = "You ."; // Placeholder response
      return { sql, res };
    },
  },
  {
    key: "6",
    icon: <BookOutlined style={{ color: "#52C41A" }} />,
    description: "Current number of questions",
    callback: async (userId: number) => {
      // Temporary SQL and response for the callback
      const sql = "SELECT "; // Placeholder SQL
      const res = "You ."; // Placeholder response
      return { sql, res };
    },
  },
];

// Define a type for chat messages
type ChatMessage = {
  id: string;
  content: string;
  sender: "user" | "bot";
};

export default function Chatbot() {
  // fetch current user
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [isStudent, setIsStudent] = useState<boolean>(true);

  const [messageValue, setMessageValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "1",
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [messageApi, contextHolder] = message.useMessage();

  // check user's role is Student or Instructor/Admin
  useEffect(() => {
    if (currentUser?.role) {
      setIsStudent(currentUser.role === "student");
    }
  }, [currentUser]);

  // Mock send message
  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        messageApi.success("Message sent successfully!");

        // Simulate bot reply (optional)
        setTimeout(() => {
          setChatHistory((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              content: "Thanks for your message! How can I assist further?",
              sender: "bot",
            },
          ]);
        }, 1000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleSendMessage = () => {
    if (messageValue.trim()) {
      // Add user message to chat history
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: messageValue,
          sender: "user",
        },
      ]);

      setMessageValue("");
      setLoading(true);
      messageApi.info("Sending message...");
    } else {
      messageApi.warning("Please enter a message");
    }
  };

  // Handle clicking a prompt
  const handlePromptClick = async (description: string) => {
    // Add the clicked prompt as a user message
    console.log("Selected prompt:", description);
    setChatHistory((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        content: description,
        sender: "user",
      },
    ]);
    setLoading(true); // Simulate sending
    messageApi.info("Sending message...");

    // Simulate fetching the response from the callback function
    const item = isStudent
      ? studentItems.find((item) => item.description === description)
      : instructorItems.find((item) => item.description === description);

    if (item) {
      const userId = currentUser?.user_id;
      const { sql, res } = await item.callback(userId);

      // Send SQL message from bot
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `AI generates SQL: ${sql}`,
          sender: "bot",
        },
      ]);
      setLoading(false);
      messageApi.info("AI is generating SQL...");

      // Wait for 3 seconds before showing the result message
      setLoading(true);
      setTimeout(() => {
        // Send result message from bot after a 3-second delay
        setChatHistory((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            content: res,
            sender: "bot",
          },
        ]);
        messageApi.success("Found answer successfully!");
      }, 3000); // 3-second delay
    }
    setLoading(false);
  };

  return (
    <div
      id="wd-chatbot-screen"
      style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}
    >
      {contextHolder}
      <Card
        title="AI Assistant"
        bordered={false}
        headStyle={{ borderBottom: 0, textAlign: "center" }}
        bodyStyle={{ padding: "16px 0" }}
      >
        <Flex
          vertical
          gap="large"
          style={{ height: "60vh", overflowY: "auto", padding: "0 16px" }}
        >
          {/* Render chat history */}
          {chatHistory.map((msg) => (
            <Bubble
              key={msg.id}
              placement={msg.sender === "user" ? "end" : "start"}
              variant={msg.sender === "user" ? "filled" : "outlined"}
              avatar={{ icon: <UserOutlined /> }}
              content={<Text>{msg.content}</Text>}
            />
          ))}
        </Flex>

        {/* Prompts bubble  */}
        <Bubble
          variant="borderless"
          avatar={{ icon: <BarChartOutlined /> }}
          content={
            <Prompts
              title={
                isStudent
                  ? "Common Student Questions"
                  : "Common Instructor Questions"
              }
              items={isStudent ? studentItems : instructorItems}
              onItemClick={(item) =>
                handlePromptClick(item.data.description as string)
              } // Add click handler
              wrap
            />
          }
        />

        <div
          style={{
            padding: "16px",
            borderTop: "1px solid #f0f0f0",
            marginTop: "16px",
          }}
        >
          <Sender
            placeholder="Type your question here..."
            loading={loading}
            value={messageValue}
            onChange={(v) => setMessageValue(v)}
            onSubmit={handleSendMessage}
            onCancel={() => {
              setLoading(false);
              messageApi.error("Message cancelled");
            }}
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ borderRadius: "20px" }}
          />
        </div>
      </Card>
    </div>
  );
}
