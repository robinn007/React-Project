// src/components/calculator/Visualization.jsx
import React from 'react';
import ThreeDVisualization from './ThreeDVisualization';

/**
 * Wrapper component for 3D visualization.
 * @param {Object} containerDimensions - Container dimensions
 * @param {Object[]} packedItems - Array of packed items
 */
export const Visualization = ({ containerDimensions, packedItems }) => {
  return (
    <ThreeDVisualization
      containerDimensions={containerDimensions}
      packedItems={packedItems}
    />
  );
};