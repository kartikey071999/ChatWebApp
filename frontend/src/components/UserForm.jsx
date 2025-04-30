import { useState } from "react";
import axios from "axios";

const UserForm = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    try {
      const res = await axios.post("/api/users", { username });
      setMessage(`User "${res.data.username}" created with ID ${res.data.id}`);
      setUsername("");
    } catch (err) {
      console.error("Error creating user:", err);
      setMessage("Error creating user");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Create New User</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create User
        </button>
      </form>
      {message && <p className="mt-4 text-sm text-blue-600">{message}</p>}
    </div>
  );
};

export default UserForm;
