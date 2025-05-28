// src/components/calculator/RegistrationForm.jsx
import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

/**
 * Registration form for accessing 3D visualization with manual and Google login options.
 * @param {Object} props
 * @param {Function} props.onRegisterSuccess - Callback on successful registration
 * @param {Function} props.onCancel - Callback to cancel registration
 */
export const RegistrationForm = ({ onRegisterSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNo: '',
    emailId: '',
    password: '',
    city: '',
    message: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.mobileNo.trim()) newErrors.mobileNo = 'Mobile No. is required';
    else if (!/^\d{10}$/.test(formData.mobileNo)) newErrors.mobileNo = 'Mobile No. must be 10 digits';
    if (!formData.emailId.trim()) newErrors.emailId = 'Email ID is required';
    else if (!/\S+@\S+\.\S+/.test(formData.emailId)) newErrors.emailId = 'Email ID is invalid';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Manual Registration Data:', formData);
      alert('Registration successful!');
      onRegisterSuccess();
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log('Google Login Success:', decoded);
      // Simulate registration with Google user data
      const googleUser = {
        fullName: decoded.name || 'Google User',
        emailId: decoded.email,
        // Other fields can be set to defaults or left empty
        mobileNo: '',
        password: '',
        city: '',
        message: 'Registered via Google',
      };
      console.log('Google Registration Data:', googleUser);
      alert('Google Login successful!');
      onRegisterSuccess();
    } catch (error) {
      console.error('Google Login Error:', error);
      alert('Failed to process Google Login');
    }
  };

  const handleGoogleError = () => {
    console.log('Google Login Failed');
    alert('Google Login failed. Please try again.');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Register to View 3D Visualization
        </h2>

        {/* Google Login Button */}
        <div className="mb-6">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            text="signin_with"
            width="100%"
          />
        </div>

        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-4 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Manual Registration Form */}
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />
          <Input
            label="Mobile No."
            name="mobileNo"
            type="tel"
            value={formData.mobileNo}
            onChange={handleChange}
            error={errors.mobileNo}
            required
          />
          <Input
            label="Email ID"
            name="emailId"
            type="email"
            value={formData.emailId}
            onChange={handleChange}
            error={errors.emailId}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            required
          />
          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button onClick={onCancel} variant="gray">Cancel</Button>
            <Button type="submit">Register</Button>
          </div>
        </form>
      </div>
    </div>
  );
};