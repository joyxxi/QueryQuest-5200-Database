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
    const response = await fetch(
      `http://127.0.0.1:8000/api/allmessages/${username}/`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching messages:", error);
    return { status: "error", messages: [] };
  }
};

// Fetch all users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/allusers/");
    const data: UsersResponse = await response.json();
    if (data.status === "success") {
      return data.users.map((username) => ({ username }));
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
    const response = await fetch(
      `http://127.0.0.1:8000/api/mark_as_read/${messageId}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.ok;
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
    const response = await fetch("http://127.0.0.1:8000/api/send_message/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiver_username: receiver,
        m_content: content,
        sender_username: sender,
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error sending message:", error);
    return false;
  }
};

export type { Message, User, ApiResponse };
