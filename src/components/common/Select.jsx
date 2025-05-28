import React from 'react';
import { containerTypes } from '../../utils/containerTypes';

export const Select = ({ label, className = '', ...props }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 ${className}`}
        {...props}
      >
        <option value="">Select container</option>
        {containerTypes.map((ct, i) => (
          <option key={i} value={ct.name}>
            {ct.name} (Max: {ct.cbm} CBM, {ct.weight} kg)
          </option>
        ))}
      </select>
    </div>
  );
};