import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

const ChatPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Set logged-in user (from LoginPage state)
  const loggedInUser = state?.username || "Guest"; // Default to "Guest" if no username

  // Sample list of users for now
  const users = [
    { id: 1, username: "User1" },
    { id: 2, username: "User2" },
    { id: 3, username: "User3" },
    { id: 4, username: "User4" },
  ];

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r">
        <ChatSidebar
          currentUser={loggedInUser} // Passing logged-in user information to the sidebar
          users={users}
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
          onProfileClick={() => navigate("/account")}
        />
      </div>
      <div className="flex-1">
        {selectedUserId ? (
          <ChatWindow
            currentUser={loggedInUser} // Passing logged-in user information to the chat window
            selectedUserId={selectedUserId}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
