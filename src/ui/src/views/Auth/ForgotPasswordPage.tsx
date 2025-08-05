import React, { useState } from "react";
import styles from "../../css/auth-page.module.css";
import { toast } from "react-toastify";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const FORGOT_PASSWORD_URL = `${BACKEND_URL}/api/forgotPassword`;

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(FORGOT_PASSWORD_URL, { email });
      const data = res.data;
      
      if (data.success === true) {
        toast.success("Password reset email sent! Check your inbox.");
        setIsSubmitted(true);
      } else {
        toast.error(data.message || "Failed to send reset email. Please try again.");
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>
          {isSubmitted ? 'Check your email' : 'Forgot password?'}
        </h1>
        
        {isSubmitted ? (
          <div className={styles.successMessage}>
            <p className="text-center mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <p className="text-center mb-6 text-sm">
              If you don't see the email, check your spam folder or try again with a different email address.
            </p>
            <div className="text-center">
              <button 
                className={styles.switchBtn}
                onClick={() => window.location.href = '/auth'}
              >
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="text-center mb-6 text-sm">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleInputChange}
                  required
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send reset link'}
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
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;