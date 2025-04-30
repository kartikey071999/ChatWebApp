import React from "react";

const ChatSidebar = ({
  currentUser,   // Logged-in user info
  users,         // List of all users
  selectedUserId,
  onSelectUser,
  onProfileClick
}) => {
  return (
    <div className="p-4">
      <div className="mb-4">
        <button
          onClick={onProfileClick}
          className="w-full text-left bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
        >
          {currentUser}'s Profile
        </button>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Users</h2>
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user.id}
              className={`p-2 cursor-pointer rounded ${
                user.username === currentUser
                  ? "bg-blue-100 font-bold"
                  : selectedUserId === user.id
                  ? "bg-blue-300"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => onSelectUser(user.id)}
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
