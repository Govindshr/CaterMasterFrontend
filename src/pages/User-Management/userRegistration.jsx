import React, { useState } from 'react';
import { postApi } from '@/services/nodeapi';
import { config } from '@/services/nodeconfig';
export default function UserRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    userType: 'user'
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
    setMatchError(
      password === confirmPassword ? '' : 'Passwords do not match.'
    );
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
    status: 'active' // or set dynamically if needed
  };

   try {
      const response = await postApi(config.RegisterUser, payload);
      // setLocations(response.data);
      alert('Registration successful!');
    console.log(res.data);
    // Optionally reset form
    setFormData({
      fullName: '',
      mobile: '',
      password: '',
      confirmPassword: '',
      userType: 'user'
    });
    } catch (error) {
       if (err.response?.data?.message) {
      alert(err.response.data.message);
    } else {
      alert('Something went wrong. Please try again.');
    }
    console.error(err);
    }

};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">User Registration</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
            required
          />
          {mobileError && <p className="text-red-600 text-sm mt-1">{mobileError}</p>}
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
            required
          />
          <span
            className="absolute right-4 top-11 text-sm text-blue-600 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
          {passwordError && <p className="text-red-600 text-sm mt-1">{passwordError}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Confirm Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
            required
          />
          {matchError && <p className="text-red-600 text-sm mt-1">{matchError}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">User Type</label>
          <select
            name="userType"
            value={formData.userType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3"
          >
            <option value="super admin">Super Admin</option>
            <option value="user">User</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={!!passwordError || !!matchError || !!mobileError}
          className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}