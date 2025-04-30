import { useState } from "react"

const ChatSidebar = ({ selectedUser, setSelectedUser }) => {
  const users = ["Alice", "Bob", "Charlie"]

  return (
    <div className="chat-sidebar">
      <h3>Chats</h3>
      <ul>
        {users.map((user) => (
          <li
            key={user}
            className={selectedUser === user ? "active" : ""}
            onClick={() => setSelectedUser(user)}
          >
            {user}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ChatSidebar
