import React, { useState, useEffect } from "react";
import styles from "../css/auth-page.module.css";
import { toast } from "react-toastify";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const RESET_PASSWORD_URL = `${BACKEND_URL}/api/resetPassword`;

const ResetPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userIdParam = urlParams.get('id');
    const tokenParam = urlParams.get('token');

    if (!userIdParam || !tokenParam) {
      setIsValidToken(false);
      toast.error("Invalid reset link. Please request a new password reset.");
      return;
    }

    setUserId(userIdParam);
    setToken(tokenParam);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post(RESET_PASSWORD_URL, {
        id: userId,
        token: token,
        password: formData.password
      });
      const data = res.data;
      
      if (data.success === true) {
        toast.success("Password reset successful! You can now log in with your new password.");
        setIsResetSuccessful(true);        
      } else {
        toast.error(data.message || "Failed to reset password. Please try again.");
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else if (err.response?.status === 400) {
        toast.error("Invalid or expired reset link. Please request a new one.");
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isValidToken) {
    return (
      <div className={styles.container}>
        <div className={styles.authCard}>
          <h1 className={styles.title}>Invalid reset link</h1>
          <p className="text-center mb-6">
            This password reset link is invalid or has expired.
          </p>
          <div className="text-center">
            <button 
              className={styles.submitBtn}
              onClick={() => window.location.href = '/forgot-password'}
            >
              Request new reset link
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isResetSuccessful) {
    return (
      <div className={styles.container}>
        <div className={styles.authCard}>
          <h1 className={styles.title}>Password reset successful</h1>
          <p className="text-center mb-6">
            Your password has been successfully updated. You can now log in to your account with your new password.
          </p>
          <p className="text-center mb-6 text-sm">
            Welcome back to the realm, adventurer.
          </p>
          <div className="text-center">
            <a 
              className={styles.submitBtn}
              href="/auth"
            >
              Go to login page
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Reset your password</h1>
        
        <p className="text-center mb-6 text-sm">
          Enter your new password below to complete the reset process.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="password">New password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your new password"
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Confirm new password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm your new password"
              disabled={isLoading}
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? 'Resetting...' : 'Reset password'}
          </button>
        </form>

        <p className={styles.switchText}>
          Remember your password? 
          <button 
            type="button"
            className={styles.switchBtn}
            onClick={() => window.location.href = '/auth'}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;