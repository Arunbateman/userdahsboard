import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // Step 1: Enter email, Step 2: Enter OTP, Step 3: Reset password
  const [otp, setOtp] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/userss?email=${email}`);
      
      if (response.data.length === 0) {
        alert("Invalid email! This email is not registered.");
        return;
      }

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setOtp(generatedOtp);

      alert(`OTP sent to ${email}: ${generatedOtp}`);
      setStep(2);
    } catch (error) {
      console.error("Error validating email or sending OTP:", error);
    }
  };

  const verifyOtp = () => {
    if (enteredOtp === otp) {
      setStep(3);
    } else {
      alert("Invalid OTP! Please try again.");
    }
  };

  const resetPassword = async () => {
    try {
      const response = await axios.get(`http://localhost:5002/userss?email=${email}`);
      if (response.data.length === 0) {
        alert("Error: Email not found.");
        return;
      }

      const userId = response.data[0].id;

      await axios.patch(`http://localhost:5002/userss/${userId}`, {
        password: newPassword,
      });

      alert("Password updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error updating password:", error);
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
    <div className="forgot-password-container">
      {step === 1 && (
        <div>
          <h2>Forgot Password</h2>
          <input
            type="email"
            className="form-input"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button onClick={sendOtp}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Enter OTP</h2>
          <input
            type="text"
            className="form-input"
            placeholder="Enter OTP"
            value={enteredOtp}
            onChange={(e) => setEnteredOtp(e.target.value)}
            required
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Reset Password</h2>
          <input
            type="password"
            className="form-input"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button onClick={resetPassword}>Reset Password</button>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
