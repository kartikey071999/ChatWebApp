import React from "react";

const ChatWindow = ({ currentUser, selectedUserId }) => {
  const users = [
    { id: 1, username: "User1" },
    { id: 2, username: "User2" },
    { id: 3, username: "User3" },
    { id: 4, username: "User4" },
  ];

  const selectedUser = users.find((user) => user.id === selectedUserId);
  const chatMessages = [
    { sender: 1, message: "Hello, how are you?" },
    { sender: 2, message: "I'm good! How about you?" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 bg-gray-100">
        <h2 className="text-xl">{selectedUser ? selectedUser.username : "Select a user"}</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${msg.sender === 1 ? "text-right" : "text-left"}`}
          >
            <span className={`font-bold ${msg.sender === 1 ? "text-blue-500" : "text-green-500"}`}>
              {msg.sender === 1 ? currentUser : selectedUser?.username}:
            </span>
            <span>{msg.message}</span>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
};

export default ChatWindow;
