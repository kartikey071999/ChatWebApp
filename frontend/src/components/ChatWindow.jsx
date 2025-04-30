import { useState } from "react"
import axios from "axios"

const ChatWindow = ({ user, otherUser }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  const fetchMessages = async () => {
    const res = await axios.get(`/messages/${user}/${otherUser}`)
    setMessages(res.data)
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    await axios.post("/messages/", {
      from_user: user,
      to_user: otherUser,
      text: input,
    })

    setInput("")
    fetchMessages() // Fetch updated messages after sending
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        Chatting with {otherUser}
      </div>
      <div className="chat-messages">
        {messages.map((message) => (
          <div key={message.id}>
            <strong>{message.from_user}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          className="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button className="send-btn" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
