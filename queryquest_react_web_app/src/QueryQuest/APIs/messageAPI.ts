import axios from "axios";

export const REMOTE_SERVER = process.env.REACT_APP_REMOTE_SERVER;

interface Message {
  message_id: number;
  m_content: string;
  created_at: string;
  is_read: number; // 0 or 1
  sender_username: string;
  receiver_username: string;
}

interface User {
  username: string;
}

interface ApiResponse {
  status: string;
  messages: Message[];
}

interface UsersResponse {
  status: string;
  users: string[];
}

// Fetch all messages
export const fetchMessages = async (username: string): Promise<ApiResponse> => {
  try {
    const response = await axios.get<ApiResponse>(
      `${REMOTE_SERVER}/api/allmessages/${username}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { status: "error", messages: [] };
  }
};

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get<UsersResponse>(`${REMOTE_SERVER}/api/allusers/`);
    if (response.data.status === "success") {
      return response.data.users.map((username) => ({ username }));
    }
    return [];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

// Mark message as read
export const markMessageAsRead = async (
  messageId: number
): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${REMOTE_SERVER}/api/mark_as_read/${messageId}/`
    );
    return response.status === 200;
  } catch (error) {
    console.error("Error marking message as read:", error);
    return false;
  }
};

// Send new message
export const sendMessage = async (
  receiver: string,
  content: string,
  sender: string
): Promise<boolean> => {
  try {
    const response = await axios.post(`${REMOTE_SERVER}/api/send_message/`, {
      receiver_username: receiver,
      m_content: content,
      sender_username: sender,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.status >= 200 && response.status < 300;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};

export type { Message, User, ApiResponse };