import React, { useState } from 'react';
import { postApi } from '@/services/nodeapi';
import { config } from '@/services/nodeconfig';
import { useNavigate } from 'react-router-dom';

export default function UserLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobile: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!/^\d{10}$/.test(formData.mobile)) {
      errs.mobile = 'Mobile number must be 10 digits';
    }
    if (!formData.password.trim()) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  try {
    const response = await postApi(config.Login, {
      mobile: formData.mobile,
      password: formData.password
    });

    console.log('Login response:', response);

    const { token, user } = response;

    alert('Login successful!');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    navigate('/home');
  } catch (error) {
    if (error.response?.data?.message) {
      alert(error.response.data.message);
    } else {
      alert('Something went wrong. Please try again.');
    }
    console.error(error);
  }
};





  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

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
          {errors.mobile && (
            <small className="text-red-500">{errors.mobile}</small>
          )}
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700 mb-2">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-xl p-3 pr-10"
            required
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-10 cursor-pointer text-sm text-blue-500"
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
          {errors.password && (
            <small className="text-red-500">{errors.password}</small>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
