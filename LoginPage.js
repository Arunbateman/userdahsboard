import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './LoginPage.css'; // Importing the CSS for styling

const LoginPage = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    installationId: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Fetch all users from signup.json
      const response = await axios.get("http://localhost:5002/userss");
      const users = response.data;

      // Find a matching user
      const user = users.find(
        (u) =>
          u.installationId === credentials.installationId &&
          u.password === credentials.password
      );

      if (user) {
        // Store the logged-in user data in login.json
        await axios.post("http://localhost:5001/users", {
          userId: user.id,
          installationId: user.installationId,
          loginTime: new Date().toISOString(),
        });

        // Simulate a 3-second delay before navigating to the dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        setError("Invalid Installation ID or Password");
        setIsLoading(false);
      }
    } catch (error) {
      setError("An error occurred while connecting to the server.");
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    const handleFocus = () => document.body.classList.add("input-focused");
    const handleBlur = () => document.body.classList.remove("input-focused");

    const inputs = document.querySelectorAll(".form-input");
    inputs.forEach((input) => {
      input.addEventListener("focus", handleFocus);
      input.addEventListener("blur", handleBlur);
    });

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("focus", handleFocus);
        input.removeEventListener("blur", handleBlur);
      });
    };
  }, []);

  return (
    <div className="form-container">
      <h1 className="login-heading">Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-input"
          name="installationId"
          placeholder="Installation ID"
          value={credentials.installationId}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          className="form-input"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />

        {!isLoading && <button type="submit">Login</button>}
      </form>

      {/* Error message displayed below the form */}
      {error && <div className="error">{error}</div>}

      {/* Conditionally hide links while loading */}
      {!isLoading && (
        <>
          <span
            className="navigate-link"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password
          </span>
          <p>
            Don't have an account?{" "}
            <span className="navigate-link" onClick={() => navigate("/signup")}>
              Sign Up
            </span>
          </p>
        </>
      )}

      {/* Display spinner below the Forgot Password link while loading */}
      {isLoading && (
        <div className="spinner">
          <div className="spin"></div>
          <p>Logging in...</p>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
/*  */