import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { useStateContext } from '../context/StateContext';

const AuthModal = ({ onClose }) => {
  const router = useRouter();
  const { setUser } = useStateContext();

  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup && formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords do not match");
      return;
    }

    const endpoint = isSignup
      ? 'http://localhost:8080/api/auth/signup'
      : 'http://localhost:8080/api/auth/login';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // important for cookie
        body: JSON.stringify(
          isSignup
            ? { name: formData.name, email: formData.email, password: formData.password }
            : { email: formData.email, password: formData.password }
        ),
      });

      const data = await res.json(); // ✅ correct way to parse response

      if (!res.ok) {
        if (data === "User already exists") {
          toast.error("❌ User already exists");
        } else if (data === "Invalid username") {
          toast.error("❌ Invalid username");
        } else if (data === "Invalid password") {
          toast.error("❌ Invalid password");
        } else {
          toast.error("❌ Something went wrong");
        }
        return;
      }

      setUser(data.user); // ✅ save user to context
      toast.success(isSignup ? "✅ Signup successful!" : "✅ Login successful!");
      onClose();
      router.push("/"); // ✅ redirect to homepage

    } catch (error) {
      toast.error("❌ Something went wrong. Try again.");
      console.error(error);
    }
  };

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 style={{ color: '#f02d34', textAlign: 'center', marginBottom: '20px' }}>
          {isSignup ? 'Create Account' : 'Login'}
        </h2>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="auth-input"
              onChange={handleChange}
              value={formData.name}
              required
            />
          )}

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

          {isSignup && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="auth-input"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          <button type="submit" className="auth-submit-btn">
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p className="toggle-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button className="toggle-btn" onClick={() => setIsSignup(prev => !prev)}>
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
