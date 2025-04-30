import { useState } from "react"
import ChatSidebar from "../components/ChatSidebar"
import ChatWindow from "../components/ChatWindow"

const Chats = () => {
  const [selectedUser, setSelectedUser] = useState("Alice") // default to Alice

  return (
    <div className="chat-container">
      <ChatSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      <ChatWindow user="John" otherUser={selectedUser} />
    </div>
  )
}

export default Chats
