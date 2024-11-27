import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    installationId: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Track whether the field has been focused
  const [focusedFields, setFocusedFields] = useState({
    name: false,
    email: false,
    installationId: false,
    password: false,
    confirmPassword: false,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const newUser = {
        name: formData.name,
        email: formData.email,
        installationId: formData.installationId,
        password: formData.password,
      };

      const response = await axios.get("http://localhost:5001/users");
      const users = response.data;

      const emailExists = users.some((user) => user.email === newUser.email);
      const idExists = users.some(
        (user) => user.installationId === newUser.installationId
      );

      if (emailExists) {
        setError("Email already exists!");
        setIsLoading(false);
        return;
      }

      if (idExists) {
        setError("Installation ID already exists!");
        setIsLoading(false);
        return;
      }

      await axios.post("http://localhost:5002/userss", newUser);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      setError("An error occurred while creating the account.");
      setIsLoading(false);
    }
  };

  // Dimming effect using useEffect
  useEffect(() => {
    const handleFocus = (e) => {
      const fieldName = e.target.name;
      if (!focusedFields[fieldName]) {
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: "", // Clear the value on first focus
        }));
        setFocusedFields((prev) => ({ ...prev, [fieldName]: true }));
      }
      document.body.classList.add("input-focused");
    };

    const handleBlur = () => {
      document.body.classList.remove("input-focused");
    };

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
  }, [focusedFields]);

  return (
    <div className="form-container">
      <h1 className="signup-heading">Sign Up</h1>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-input"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          className="form-input"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          className="form-input"
          name="installationId"
          placeholder="Installation ID"
          value={formData.installationId}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          className="form-input"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          className="form-input"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        {!isLoading ? (
          <button type="submit">Sign Up</button>
        ) : (
          <div className="spinner">
            <div className="spin"></div>
          </div>
        )}
      </form>
      <p>
        Already have an account?{" "}
        <span
          className="navigate-link"
          onClick={() => navigate("/")}
        >
          Login here
        </span>
      </p>
    </div>
  );
};

export default SignUpPage;
