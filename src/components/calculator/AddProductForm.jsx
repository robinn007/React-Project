// src/components/calculator/AddProductForm.jsx
import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

/**
 * Form component to add new cargo items to the database for container packing.
 */
export  function AddProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    color: '#FF5733', // Default color matching App.jsx items
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.length || formData.length <= 0) {
      setError('Length must be greater than 0');
      return;
    }
    if (!formData.width || formData.width <= 0) {
      setError('Width must be greater than 0');
      return;
    }
    if (!formData.height || formData.height <= 0) {
      setError('Height must be greater than 0');
      return;
    }
    if (!formData.weight || formData.weight <= 0) {
      setError('Weight must be greater than 0');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          length: Number(formData.length), // cm
          width: Number(formData.width), // cm
          height: Number(formData.height), // cm
          weight: Number(formData.weight), // kg
          color: formData.color, // Hex color
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item');
      }
      const data = await response.json();
      setSuccess('Item added successfully!');
      setError(null);
      setFormData({
        name: '',
        length: '',
        width: '',
        height: '',
        weight: '',
        color: '#FF5733',
      });
    } catch (err) {
      setError(err.message);
      setSuccess(null);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Cargo Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Item Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Length (cm)"
          name="length"
          type="number"
          value={formData.length}
          onChange={handleChange}
          required
          min="0.1"
          step="0.1"
        />
        <Input
          label="Width (cm)"
          name="width"
          type="number"
          value={formData.width}
          onChange={handleChange}
          required
          min="0.1"
          step="0.1"
        />
        <Input
          label="Height (cm)"
          name="height"
          type="number"
          value={formData.height}
          onChange={handleChange}
          required
          min="0.1"
          step="0.1"
        />
        <Input
          label="Weight (kg)"
          name="weight"
          type="number"
          value={formData.weight}
          onChange={handleChange}
          required
          min="0.1"
          step="0.1"
        />
        <Input
          label="Color (Hex)"
          name="color"
          type="color"
          value={formData.color}
          onChange={handleChange}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}
        <Button type="submit">Add Item</Button>
      </form>
    </div>
  );
}