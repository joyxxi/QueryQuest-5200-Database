import React, { useState, useEffect } from 'react';

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

export default function Message() {
  const [apiResponse, setApiResponse] = useState<ApiResponse>({ status: '', messages: [] });
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [newMessage, setNewMessage] = useState({
    receiver: '',
    content: ''
  });

  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch messages from Django backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/allmessages/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: ApiResponse = await response.json();
        setApiResponse(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setApiResponse({ status: 'error', messages: [] });
      }
    };

    fetchMessages();
  }, []);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const response = await fetch('http://127.0.0.1:8000/api/allusers/');
        const data = await response.json();
        if (data.status === "success") {
          setUsers(data.users.map((username: string) => ({ username })));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  const handleMessageClick = async (message: Message) => {
    // Only proceed if message isn't already read
    if (message.is_read !== 1) {
      try {
        // Call your Django API to mark as read
        const response = await fetch(
          `http://127.0.0.1:8000/api/mark_as_read/${message.message_id}/`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
  
        if (response.ok) {
          // Update local state only after successful API call
          const updatedMessages = messages.map(msg => 
            msg.message_id === message.message_id ? { ...msg, is_read: 1 } : msg
          );
          setMessages(updatedMessages);
          setSelectedMessage({ ...message, is_read: 1 });
        } else {
          console.error('Failed to mark message as read');
        }
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    } else {
      // Message is already read, just select it
      setSelectedMessage(message);
    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/allmessages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiver_username: newMessage.receiver,
          m_content: newMessage.content
        }),
      });

      if (response.ok) {
        // Refresh messages after sending
        const updatedResponse = await fetch('http://127.0.0.1:8000/api/allmessages/');
        const updatedData: ApiResponse = await updatedResponse.json();
        setApiResponse(updatedData);
        
        setShowPopup(false);
        setNewMessage({ receiver: '', content: '' });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const closePopup = () => {
    setSelectedMessage(null);
  };

  return (
    <div id="wd-message-screen" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Message Center</h2>
        <button 
          id="wd-add-message" 
          onClick={() => setShowPopup(true)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Message
        </button>
      </div>

      {/* Messages Table */}
      <div style={{ border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
        {apiResponse.messages && apiResponse.messages.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>From</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>To</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Preview</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {apiResponse.messages.map(message => (
                <tr 
                  key={message.message_id} 
                  onClick={() => handleMessageClick(message)}
                  style={{
                    borderTop: '1px solid #ddd',
                    cursor: 'pointer',
                    backgroundColor: message === selectedMessage ? '#f0f7ff' : 'white'
                  }}
                >
                  <td style={{ padding: '12px' }}>
                    {message.is_read ? (
                      <span style={{ color: 'green' }}>✓</span>
                    ) : (
                      <span style={{ color: 'blue' }}>○</span>
                    )}
                  </td>
                  <td style={{ padding: '12px' }}>{message.sender_username}</td>
                  <td style={{ padding: '12px' }}>{message.receiver_username}</td>
                  <td style={{ padding: '12px' }}>
                    {message.m_content.length > 10 
                      ? `${message.m_content.substring(0, 10)}...` 
                      : message.m_content}
                  </td>
                  <td style={{ padding: '12px' }}>{new Date(message.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            {apiResponse.status === 'error' ? 'Error loading messages' : 'No messages found'}
          </div>
        )}
      </div>

      {/* Message Detail Popup */}
      {selectedMessage && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '600px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Message Details</h3>
              <button onClick={closePopup} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>From:</strong> {selectedMessage.sender_username}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>To:</strong> {selectedMessage.receiver_username}
            </div>
            <div style={{ marginBottom: '10px' }}>
              <strong>Time:</strong> {new Date(selectedMessage.created_at).toLocaleString()}
            </div>
            <div style={{ 
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f9f9f9',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              {selectedMessage.m_content}
            </div>
          </div>
        </div>
      )}

      {/* New Message Popup */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '80%',
            maxWidth: '500px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>New Message</h3>
              <button onClick={() => setShowPopup(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
            
            {/* User Selection Dropdown - Now properly inside the white container */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>To:</label>
              {loadingUsers ? (
                <p>Loading users...</p>
              ) : (
                <select
                  value={newMessage.receiver}
                  onChange={(e) => setNewMessage({...newMessage, receiver: e.target.value})}
                  style={{ 
                    width: '100%', 
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    backgroundColor: 'white'
                  }}
                  required
                >
                  <option value="">Select a user</option>
                  {users.map((user) => (
                    <option key={user.username} value={user.username}>
                      {user.username}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Message:</label>
              <textarea
                value={newMessage.content}
                onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                style={{ 
                  width: '100%', 
                  padding: '8px', 
                  boxSizing: 'border-box', 
                  minHeight: '100px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}