import { useState, useEffect, useRef } from "react";
// src/pages/ChatPage/ChatWindow.jsx
import './ChatWindow.css'; // Import ChatWindow styles

const messagesData = {
  2: [
    { from: 1, content: "Hi Jane!" },
    { from: 2, content: "Hey John, how's it going?" },
    { from: 1, content: "All good! Just checking in." },
  ],
  3: [
    { from: 1, content: "Hey Jack!" },
    { from: 3, content: "Yo John, what's up?" },
    { from: 1, content: "Not much, just wanted to chat!" },
  ],
};

const ChatWindow = ({ currentUser, selectedUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  useEffect(() => {
    setMessages(messagesData[selectedUserId] || []);
  }, [selectedUserId]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg = { from: currentUser.id, content: newMessage };
    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Scroll to bottom
    setTimeout(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-50">
      <div className="flex-1 overflow-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xs px-4 py-2 rounded-md ${
              msg.from === currentUser.id
                ? "bg-blue-500 text-white self-end ml-auto"
                : "bg-gray-200 text-black self-start mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>
      <div className="border-t p-3 flex items-center bg-white shadow-md rounded-md mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-md px-4 py-2 mr-2"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
