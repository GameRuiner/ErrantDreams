import React, { useState } from "react";
import styles from "../css/auth-page.module.css";

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add authentication logic here
    console.log('Form submitted:', formData);
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