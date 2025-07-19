import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useStateContext } from '../context/StateContext';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


const AuthModal = ({ onClose }) => {
  const router = useRouter();
  const { setUser } = useStateContext();

  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Signup: Step 1 - send OTP
    if (isSignup && step === 1) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("❌ Passwords do not match");
        return;
      }

      try {
        // ✅ Send OTP (signup - step 1)
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/send-otp`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: formData.email }),
});


        const data = await res.json();
        if (!res.ok) {
          toast.error(`❌ ${data.error || "Failed to send OTP"}`);
          return;
        }

        toast.success("✅ OTP sent to email");
        setStep(2);
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to send OTP");
      }

      return;
    }

    // Signup: Step 2 - verify OTP & create user
    if (isSignup && step === 2) {
      try {
        // ✅ Verify OTP (signup - step 2)
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/verify-otp`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    name: formData.name,
    email: formData.email,
    password: formData.password,
    otp: formData.otp
  }),
});

        const data = await res.json();
        if (!res.ok) {
          toast.error(`❌ ${data.error || "OTP verification failed"}`);
          return;
        }

        toast.success("✅ Signup successful!");
        setUser(data.user || { email: formData.email });
        onClose();
        router.push('/');
      } catch (err) {
        toast.error("❌ Something went wrong");
      }

      return;
    }

    // Login
    if (!isSignup) {
      try {
        // ✅ Login
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email: formData.email, password: formData.password }),
});


        const data = await res.json();

        if (!res.ok) {
          if (data?.error === "Invalid username") {
            toast.error("❌ Invalid username");
          } else if (data?.error === "Invalid password") {
            toast.error("❌ Invalid password");
          } else {
            toast.error(`❌ ${data?.error || "Login failed"}`);
          }
          return;
        }

        toast.success("✅ Login successful!");
        setUser(data.user || { email: formData.email });
        onClose();
        router.push('/');
      } catch (error) {
        toast.error("❌ Something went wrong. Try again.");
        console.error(error);
      }
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 style={{ color: '#f02d34', textAlign: 'center', marginBottom: '20px' }}>
          {isSignup ? (step === 1 ? 'Create Account' : 'Verify OTP') : 'Login'}
        </h2>

        <form onSubmit={handleSubmit}>
          {isSignup && step === 1 && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="auth-input"
                onChange={handleChange}
                value={formData.name}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="auth-input"
                onChange={handleChange}
                value={formData.email}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="auth-input"
                onChange={handleChange}
                value={formData.password}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="auth-input"
                onChange={handleChange}
                value={formData.confirmPassword}
                required
              />
            </>
          )}

          {isSignup && step === 2 && (
            <>
              <p>OTP sent to your email. Please check and enter it below.</p>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                className="auth-input"
                value={formData.otp}
                onChange={handleChange}
                required
              />
            </>
          )}

          {!isSignup && (
            <>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="auth-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit" className="auth-submit-btn">
            {isSignup ? (step === 1 ? 'Send OTP' : 'Verify OTP') : 'Login'}
          </button>
        </form>

        {step === 1 && (
          <p className="toggle-text">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button className="toggle-btn" onClick={() => {
              setIsSignup(prev => !prev);
              setStep(1);
            }}>
              {isSignup ? "Login" : "Sign Up"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
