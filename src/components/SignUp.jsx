import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../App.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [babyName, setBabyName] = useState('');
  const [babyBirthday, setBabyBirthday] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const userDocRef = doc(db, `users/${userId}`);
      await setDoc(userDocRef, {
        email,
        babyInfo: {
          name: babyName,
          birthday: babyBirthday.split('-').reverse().join('/'),
        },
      });

      toast.success('Account and baby info created successfully!');
      navigate('/login');
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already in use.');
      } else if (err.code === 'auth/invalid-email') {
        setError('The email format is invalid.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Failed to create account. Please try again.');
      }
      toast.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/logo.png" alt="Logo" className="logo" />
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="email@address.com"
            />
          </div>

          {/* Password field using Flexbox */}
          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-icon"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="form-group mt-3">
            <label>Baby's Name</label>
            <input
              type="text"
              className="form-control"
              value={babyName}
              onChange={(e) => setBabyName(e.target.value)}
              required
              placeholder="Your baby's name"
            />
          </div>
          <div className="form-group">
            <label>Baby's Birthday</label>
            <input
              type="date"
              className="form-control"
              value={babyBirthday}
              onChange={(e) => setBabyBirthday(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn login-btn mt-3">Sign Up</button>
        </form>
        <p className="mt-3 footer-links">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
