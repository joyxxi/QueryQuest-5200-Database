import React, { useState } from 'react';
import { CoffeeOutlined, FireOutlined, SmileOutlined, UserOutlined, TeamOutlined, TrophyOutlined, BookOutlined } from '@ant-design/icons';
import { Bubble, Prompts, PromptsProps, Sender } from '@ant-design/x';
import { App, Flex, Radio, RadioChangeEvent, Typography, message, Card } from 'antd';

const { Title, Text } = Typography;

const studentItems = [
  {
    key: '1',
    icon: <CoffeeOutlined style={{ color: '#964B00' }} />,
    description: 'Current total points',
  },
  {
    key: '2',
    icon: <SmileOutlined style={{ color: '#FAAD14' }} />,
    description: 'Current rank',
  },
  {
    key: '3',
    icon: <FireOutlined style={{ color: '#FF4D4F' }} />,
    description: 'Questions answered incorrectly before',
  },
];

const instructorItems = [
  {
    key: '4',
    icon: <TrophyOutlined style={{ color: '#FFD700' }} />,
    description: 'Names of the top 5 highest scorers',
  },
  {
    key: '5',
    icon: <TeamOutlined style={{ color: '#1890FF' }} />,
    description: 'Current number of students',
  },
  {
    key: '6',
    icon: <BookOutlined style={{ color: '#52C41A' }} />,
    description: 'Current number of questions',
  },
];

// Define a type for chat messages
type ChatMessage = {
  id: string;
  content: string;
  sender: 'user' | 'bot';
};

export default function Chatbot() {
  const [role, setRole] = useState<'student' | 'instructor'>('student');
  const [messageValue, setMessageValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
    },
  ]);
  const [messageApi, contextHolder] = message.useMessage();

  // Mock send message
  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        messageApi.success('Message sent successfully!');
        
        // Simulate bot reply (optional)
        setTimeout(() => {
          setChatHistory((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              content: "Thanks for your message! How can I assist further?",
              sender: 'bot',
            },
          ]);
        }, 1000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const handleRoleChange = (e: RadioChangeEvent) => {
    setRole(e.target.value);
  };

  const handleSendMessage = () => {
    if (messageValue.trim()) {
      // Add user message to chat history
      setChatHistory((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: messageValue,
          sender: 'user',
        },
      ]);
      
      setMessageValue('');
      setLoading(true);
      messageApi.info('Sending message...');
    } else {
      messageApi.warning('Please enter a message');
    }
  };

  return (
    <div id="wd-chatbot-screen" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {contextHolder}
      <Card 
        title="AI Assistant" 
        bordered={false} 
        headStyle={{ borderBottom: 0, textAlign: 'center' }}
        bodyStyle={{ padding: '16px 0' }}
      >
        <Flex vertical gap="large" style={{ height: '60vh', overflowY: 'auto', padding: '0 16px' }}>
          {/* Render chat history */}
          {chatHistory.map((msg) => (
            <Bubble
              key={msg.id}
              placement={msg.sender === 'user' ? 'end' : 'start'}
              variant={msg.sender === 'user' ? 'filled' : 'outlined'}
              avatar={{ icon: <UserOutlined /> }}
              content={<Text>{msg.content}</Text>}
            />
          ))}
          
          {/* Role selection bubble (only shown once) */}
          {chatHistory.length <= 1 && (
            <Bubble 
              variant="outlined" 
              avatar={{ icon: <UserOutlined /> }} 
              content={
                <Flex vertical gap="middle">
                  <Text strong>Please select your role:</Text>
                  <Radio.Group 
                    onChange={handleRoleChange} 
                    value={role}
                    optionType="button"
                    buttonStyle="solid"
                  >
                    <Radio.Button value="student">Student</Radio.Button>
                    <Radio.Button value="instructor">Instructor</Radio.Button>
                  </Radio.Group>
                </Flex>
              } 
            />
          )}
          
          {/* Prompts bubble (only shown once) */}
          {chatHistory.length <= 1 && (
            <Bubble
              variant="borderless"
              avatar={{ icon: <UserOutlined /> }}
              content={
                <Prompts 
                  title={role === 'student' ? "Common Student Questions" : "Common Instructor Questions"} 
                  items={role === 'student' ? studentItems : instructorItems} 
                  vertical 
                />
              }
            />
          )}
        </Flex>

        <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0', marginTop: '16px' }}>
          <Sender
            placeholder="Type your question here..."
            loading={loading}
            value={messageValue}
            onChange={(v) => setMessageValue(v)}
            onSubmit={handleSendMessage}
            onCancel={() => {
              setLoading(false);
              messageApi.error('Message cancelled');
            }}
            autoSize={{ minRows: 1, maxRows: 4 }}
            style={{ borderRadius: '20px' }}
          />
        </div>
      </Card>
    </div>
  );
}