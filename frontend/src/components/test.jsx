import { useState, useEffect } from "react";
import { sendMessage, getMessages } from "../api"; // Assuming the api file is correct

const TestComponent = () => {
  const [messages, setMessages] = useState([]); // Store messages in state
  const [status, setStatus] = useState(""); // To show status

  const testSendMessage = async () => {
    const senderId = 1; // or get this from the logged-in user
    const receiverId = 2; // ensure this is set
    const content = "Hello, how are you?"; // ensure content is a valid string

    try {
      // Send the message
      const message = await sendMessage(senderId, receiverId, content);
      console.log("Message sent:", message);

      // Fetch messages
      const messages = await getMessages(senderId, receiverId);
      console.log("Fetched messages:", messages);

      // Update state with fetched messages
      setMessages(messages);
      setStatus("Message Sent and Fetched Successfully!");
    } catch (error) {
      console.error("Error sending/fetching messages:", error);
      setStatus("Error occurred while sending/fetching messages.");
    }
  };

  useEffect(() => {
    // Call testSendMessage when the component mounts
    testSendMessage();
  }, []); // Empty array ensures it runs once when the component mounts

  return (
    <div>
      <h1>Message Test</h1>
      <button onClick={testSendMessage}>Send and Fetch Message</button>
      <p>Status: {status}</p>
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <li key={index}>{message.content}</li> // Assuming message has a 'content' property
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TestComponent;
