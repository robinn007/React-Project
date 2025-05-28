// src/components/calculator/ThreeDVisualization.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

/**
 * Array of distinct colors for fallback use.
 */
const palette = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD',
  '#D4A5A5', '#9B59B6', '#3498DB', '#E74C3C', '#2ECC71',
  '#F1C40F', '#E67E22', '#1ABC9C', '#9B59B6', '#34495E',
  '#F39C12', '#D35400', '#7F8C8D', '#8E44AD', '#C0392B',
  '#2980B9', '#27AE60', '#F1C40F', '#16A085', '#8E44AD',
  '#2C3E50', '#E91E63', '#3F51B5', '#009688', '#FF9800',
  '#795548', '#9E9E9E', '#607D8B', '#FF5722', '#673AB7',
  '#2196F3', '#00BCD4', '#4CAF50', '#FFC107', '#9C27B0',
  '#03A9F4', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFCDD2',
  '#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0',
];

/**
 * Generates a random hex color.
 * @returns {string} Hex color code
 */
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

/**
 * Box component to render a single 3D item.
 * @param {Object} props
 * @param {number[]} props.position - [x, y, z] coordinates in meters
 * @param {number[]} props.size - [width, height, length] in meters
 * @param {string} props.color - Hex color
 */
const Box = ({ position, size, color }) => (
  <mesh position={position}>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} transparent opacity={0.8} />
  </mesh>
);

/**
 * Container mesh for the transparent container.
 * @param {Object} props
 * @param {Object} props.dimensions - { length, width, height } in cm
 */
const ContainerMesh = ({ dimensions }) => {
  const size = [
    dimensions.width / 100, // x-axis
    dimensions.height / 100, // y-axis
    dimensions.length / 100, // z-axis
  ];
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#4682B4" transparent opacity={0.3} wireframe={false} />
    </mesh>
  );
};

/**
 * 3D visualization of packed items in a container.
 * @param {Object} props
 * @param {Object} props.containerDimensions - { length, width, height } in cm
 * @param {Object[]} props.packedItems - Array of packed items with position, dimensions, color
 */
export const ThreeDVisualization = ({ containerDimensions, packedItems }) => {
  if (!containerDimensions || !packedItems.length) {
    return (
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">3D Load Visualization</h3>
        <p className="text-gray-500">No items or container to display.</p>
      </div>
    );
  }

  // Render boxes with unique colors
  const boxes = packedItems.map((item, index) => (
    <Box
      key={index}
      position={[item.position.x, item.position.y, item.position.z]}
      size={[item.dimensions.width, item.dimensions.height, item.dimensions.length]}
      color={item.color || palette[index % palette.length] || getRandomColor()}
    />
  ));

  // Calculate camera position
  const maxDim = Math.max(
    containerDimensions.length / 100,
    containerDimensions.width / 100,
    containerDimensions.height / 100
  );
  const cameraPos = maxDim * 1.5;

  return (
    <div className="mt-8 bg-white shadow rounded-lg p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">3D Load Visualization</h3>
      <div style={{ width: '100%', height: '400px' }}>
        <Canvas>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <PerspectiveCamera
            makeDefault
            position={[cameraPos, cameraPos / 2, cameraPos]}
            fov={50}
          />
          <OrbitControls enableDamping dampingFactor={0.05} />
          <ContainerMesh dimensions={containerDimensions} />
          {boxes}
        </Canvas>
      </div>
      <p className="mt-2 text-sm text-gray-600 italic">
        Showing {packedItems.length} uniquely colored item(s) packed in the container. Drag to rotate, scroll to zoom.
      </p>
    </div>
  );
};

export default ThreeDVisualization;