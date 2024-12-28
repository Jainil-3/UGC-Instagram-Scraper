// pages/Register.js
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {auth} from '../firebaseConfig'; // Assuming config is in a separate file


const provider = new GoogleAuthProvider();


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert('Account created successfully');
        navigate('/search');
      })
      .catch((error) => {
        alert('Error: ' + error.message);
      });
  };
  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        navigate('/search');
      })
      .catch((error) => {
        alert('Error: ' + error.message);
      });
  };

  return (
    <div className="register-container">
    <div className="register-form">
      <h2>Create Your Account</h2>

      <form onSubmit={handleRegister} className="form-group">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          aria-label="Email"
          required
        />

        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          aria-label="Password"
          required
        />

        <div className="button-group">
          <button type="submit" className="primary-btn">SIGN UP</button>
          <button type="button" className="secondary-btn" onClick={() => navigate('/login')}>SIGN IN</button>
        </div>
      </form>

      <div className="google-login-container">
        <button className="google-sign-in-btn" onClick={handleGoogleLogin}>
          SIGN UP WITH GOOGLE
        </button>
      </div>
    </div>
  </div>
  );
}

export default Register;
