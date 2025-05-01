import { useState } from "react";
import ChatSidebar from "./ChatSidebar";
import ChatWindow from "./ChatWindow";
// src/pages/ChatPage/ChatPage.jsx
import './ChatPage.css'; // Import ChatPage styles

const ChatPage = () => {
  const currentUser = {
    id: 1,
    username: "john_doe",
    email: "john@example.com",
  };

  const users = [
    { id: 1, username: "john_doe", email: "john@example.com" },
    { id: 2, username: "jane_doe", email: "jane@example.com" },
    { id: 3, username: "jack_smith", email: "jack@example.com" },
  ];

  const [selectedUserId, setSelectedUserId] = useState(2); // Default to chat with "jane_doe"

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white border-r">
        <ChatSidebar
          currentUser={currentUser}
          users={users}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
        />
      </div>
      <div className="flex-1 bg-white">
        <ChatWindow
          currentUser={currentUser}
          selectedUserId={selectedUserId}
        />
      </div>
    </div>
  );
};

export default ChatPage;
