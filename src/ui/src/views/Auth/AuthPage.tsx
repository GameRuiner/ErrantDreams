import React, { useState } from "react";
import styles from "../../css/auth-page.module.css";
import { toast } from "react-toastify";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const REGISTER_URL = `${BACKEND_URL}/api/register`;
const LOGIN_URL = `${BACKEND_URL}/api/login`;

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const login = async (formData: { email: string; password: string }) => {
    const res = await axios.post(LOGIN_URL, formData);
    const data = res.data;
     if (data.success === true) {
      toast.success(data.message);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = '/game';
     } else {
      toast.error(data.message);
     }
  }

  const register = async (formData: { email: string; username: string; password: string, confirmPassword: string }) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match !");
      return;
    }
    console.log("Registering user with data:", formData);
    const postData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
    };
      try {
        const res = await axios.post(REGISTER_URL, postData);
        const data = res.data;
        if (data.success === true) {
          toast.success(data.message + " Please log in to continue.");
          setFormData({
            email: formData.email,
            username: '',
            password: '',
            confirmPassword: ''
          });
          setIsLogin(true);
        } else {
          toast.error(data.message);
        }
      } catch (err) {
        console.log("Some error occured", err);
      }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const username = formData.username;
    const email = formData.email;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    console.log("Form data submitted:", { username, email, password, confirmPassword });
    if (isLogin) {
      login({
        email,
        password,
      });
    } else {
      register({
        email,
        username,
        password,
        confirmPassword
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>
          {isLogin ? 'Welcome back, adventurer' : 'Join the realm'}
        </h1>
        
        <div className={styles.toggleButtons}>
          <button 
            className={`${styles.toggleBtn} ${isLogin ? styles.active : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button 
            className={`${styles.toggleBtn} ${!isLogin ? styles.active : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                placeholder="Choose your adventurer name"
              />
            </div>
          )}
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="your@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
            />
          </div>

          {!isLogin && (
            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm your password"
              />
            </div>
          )}

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? 'Enter the Realm' : 'Begin Your Journey'}
          </button>

          {isLogin && (
            <p className={styles.switchText}>
              <button 
                type="button"
                className={styles.switchBtn}
                onClick={() => window.location.href = '/forgot-password'}
              >
                Forgot password?
              </button>
            </p>
          )}
        </form>

        <p className={styles.switchText}>
          {isLogin ? "New to the realm? " : "Already have an account? "}
          <button 
            type="button"
            className={styles.switchBtn}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;