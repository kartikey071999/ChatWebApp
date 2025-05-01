import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MDBInput, MDBBtn } from "mdb-react-ui-kit";
import { createUser, loginUser } from "../api"; // Import the API functions

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Track if the user is registering
  const navigate = useNavigate();

  // Handle form submission for login or registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering) {
      // Create user if we are registering
      try {
        await createUser(username, `${username}@example.com`, password); // Create a user with a dummy email
        alert("User created successfully!");
        setUsername(""); // Clear username input
        setPassword(""); // Clear password input
        setIsRegistering(false); // Go back to the login page after registration
      } catch (err) {
        setError("Error creating user. Please try again.");
      }
    } else {
      // Handle login logic
      try {
        // Assuming the username is unique and used as user_id in the API
        const user = await loginUser(username, password); // Fetch the user by username
    
        if (user && user.password === password) {
            // Redirect to chat page if credentials are correct
            navigate("/chat", {
                state: {
                    id: user.id, // Corrected to use 'user' instead of 'data'
                    username: user.username,
                    email: user.email,
                },
            });
            setUsername(""); // Clear username input
            setPassword(""); // Clear password input
        } else {
            setError("Invalid username or password.");
        }
      } catch (err) {
        setError("User not found or error occurred.");
      }
    }
  };

  // Toggle between login and registration form
  const toggleRegister = () => {
    setIsRegistering(!isRegistering);
    setError(""); // Clear error when toggling
  };

  return (
    <div className="container my-5" style={{ maxWidth: "500px" }}>
      <form onSubmit={handleSubmit}>
        {/* Username input */}
        <div className="form-outline mb-4">
          <MDBInput
            type="text"
            id="username"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {/* Password input */}
        <div className="form-outline mb-4">
          <MDBInput
            type="password"
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Error message */}
        {error && <div className="text-danger mb-3">{error}</div>}

        {/* Submit button */}
        <MDBBtn type="submit" className="btn-block mb-4" block>
          {isRegistering ? "Register" : "Sign in"}
        </MDBBtn>
      </form>

      {/* Toggle between login and register */}
      <div className="text-center">
        {isRegistering ? (
          <p>
            Already have an account?{" "}
            <button type="button" onClick={toggleRegister}>
              Login
            </button>
          </p>
        ) : (
          <p>
            Not a member?{" "}
            <button type="button" onClick={toggleRegister}>
              Register
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
