// pages/Login.js
import { GoogleAuthProvider, getAdditionalUserInfo, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig'; // Create a separate file for Firebase config


const provider = new GoogleAuthProvider();
auth.useDeviceLanguage();

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        alert('Login successful');
        alert(userCredential.user.uid);
        navigate('/search');
      })
      .catch((error) => {
        alert('Error: ' + error.message);
      });
  };

  const handleGoogleLogin = () => {
    
    signInWithPopup(auth, provider)
      .then((result) => {
        
        const data = getAdditionalUserInfo(result).profile;
        alert(data.uid);
        navigate('/search');
      
      })
      .catch((error) => {
        alert('Error: ' + error.message);
      });
  };

  return (
    <div>
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleEmailLogin}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <div className="button-group">
              <button type="submit">SIGN IN</button>
              <button type="button" onClick={() => navigate('/register')}>SIGN UP</button>
            </div>
          </form>

          <div className="google-login-container">
            <button className="google-sign-in-btn" onClick={handleGoogleLogin}>SIGN IN WITH GOOGLE</button>
          </div>
        </div>
      </div>
    </div>

    
  );
}

export default Login;
