import React from "react";
// src/pages/ChatPage/ChatSidebar.jsx
import './ChatSidebar.css'; // Import ChatSidebar styles

const ChatSidebar = ({
  currentUser,
  users,
  selectedUserId,
  onSelectUser,
}) => {
  const chatUsers = users.filter((user) => user.id !== currentUser.id);

  return (
    <div className="h-full flex flex-col bg-white shadow-lg">
      {/* Profile Section */}
      <div className="p-4 border-b bg-gray-200">
        <div className="text-sm text-gray-500 mb-1">
          {currentUser.username}'s Profile
        </div>
        <div className="text-lg font-semibold text-blue-600">
          Your Profile
        </div>
      </div>

      {/* Chat Users */}
      <div className="flex-1 overflow-auto">
        <div className="px-4 py-2 text-sm text-gray-500 border-b">Chats</div>
        <ul className="list-none m-0 p-0">
          <li
            key={currentUser.id}
            onClick={() => onSelectUser(currentUser.id)}
            className={`px-4 py-3 cursor-pointer border-b transition-colors ease-in-out duration-200 ${
              selectedUserId === currentUser.id
                ? "bg-blue-100 text-blue-700 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            {currentUser.username} (You)
          </li>

          {chatUsers.map((user) => (
            <li
              key={user.id}
              onClick={() => onSelectUser(user.id)}
              className={`px-4 py-3 cursor-pointer border-b transition-colors ease-in-out duration-200 ${
                selectedUserId === user.id
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
