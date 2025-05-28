import React from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Select } from '../common/Select';

export const CargoInput = ({ items, selectedContainer, onInputChange, onAddItem, onRemoveItem, onContainerChange, onCalculate, onReset }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Cargo Details</h2>
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-gray-700">Item {index + 1}</h3>
              {items.length > 1 && (
                <Button variant="danger" onClick={() => onRemoveItem(index)}>
                  Remove
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              <Input
                label="Length (cm)"
                type="number"
                value={item.length}
                onChange={(e) => onInputChange(index, 'length', e.target.value)}
                min="0"
              />
              <Input
                label="Width (cm)"
                type="number"
                value={item.width}
                onChange={(e) => onInputChange(index, 'width', e.target.value)}
                min="0"
              />
              <Input
                label="Height (cm)"
                type="number"
                value={item.height}
                onChange={(e) => onInputChange(index, 'height', e.target.value)}
                min="0"
              />
              <Input
                label="Weight (kg)"
                type="number"
                value={item.weight}
                onChange={(e) => onInputChange(index, 'weight', e.target.value)}
                min="0"
              />
              <Input
                label="Quantity"
                type="number"
                value={item.quantity}
                onChange={(e) => onInputChange(index, 'quantity', e.target.value)}
                min="1"
              />
            </div>
          </div>
        ))}
      </div>
      <Button onClick={onAddItem} className="mt-4 flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add Another Item
      </Button>
      <div className="mt-6">
        <Select label="Container Options (optional)" value={selectedContainer} onChange={onContainerChange} />
      </div>
      <div className="mt-6 flex space-x-4">
        <Button onClick={onCalculate}>Calculate Load</Button>
        <Button variant="secondary" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
};