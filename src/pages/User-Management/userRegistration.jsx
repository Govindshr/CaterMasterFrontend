// Enhanced and compact user registration form
import React, { useState } from 'react';
import { postApi } from '@/services/nodeapi';
import { config } from '@/services/nodeconfig';

export default function UserRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    userType: 'user',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [matchError, setMatchError] = useState('');
  const [mobileError, setMobileError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'password') validatePasswordStrength(value);
    if (name === 'confirmPassword') validatePasswordMatch(formData.password, value);
    if (name === 'mobile') validateMobile(value);
  };

  const validatePasswordStrength = (password) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    setPasswordError(
      strongRegex.test(password)
        ? ''
        : 'Must be 8+ chars with upper, lower, number & special char.'
    );
  };

  const validatePasswordMatch = (password, confirmPassword) => {
    setMatchError(password === confirmPassword ? '' : 'Passwords do not match.');
  };

  const validateMobile = (mobile) => {
    const mobileRegex = /^[6-9]\d{9}$/;
    setMobileError(mobileRegex.test(mobile) ? '' : 'Enter valid 10-digit mobile number.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwordError || matchError || mobileError) return;

    const payload = {
      fullName: formData.fullName,
      mobile: formData.mobile,
      password: formData.password,
      userType: formData.userType,
      status: 'active',
    };

    try {
      const res = await postApi(config.RegisterUser, payload);
      alert('Registration successful!');
      console.log(res.data);
      setFormData({
        fullName: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        userType: 'user',
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm grid gap-4"
      >
        <h2 className="text-xl font-semibold text-center text-gray-800">User Registration</h2>

        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="input-style"
           autoComplete="off"
          required
        />

        <div>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
             autoComplete="off"
            className="input-style"
            required
          />
          {mobileError && <p className="error-text">{mobileError}</p>}
        </div>

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
             autoComplete="off"
            className="input-style"
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
          {passwordError && <p className="error-text">{passwordError}</p>}
        </div>

        <div>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="input-style"
             autoComplete="off"
            required
          />
          {matchError && <p className="error-text">{matchError}</p>}
        </div>

        <select
          name="userType"
          value={formData.userType}
          onChange={handleChange}
          className="input-style"
        >
          <option value="admin">Super Admin</option>
          <option value="user">User</option>
        </select>

        <button
          type="submit"
          disabled={!!passwordError || !!matchError || !!mobileError}
          className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          Sign Up
        </button>
      </form>

      <style jsx>{`
        .input-style {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #d1d5db;
        }
        .toggle-password {
          position: absolute;
          top: 0.75rem;
          right: 1rem;
          font-size: 0.875rem;
          color: #2563eb;
          cursor: pointer;
        }
        .error-text {
          color: #dc2626;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
}