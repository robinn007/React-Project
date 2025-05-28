import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';

const colors = [
  '#FFB6C1', '#87CEFA', '#90EE90', '#FFD700', '#FFA07A', '#9370DB', '#00CED1'
];

function Box({ position, size, color }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

export default function ThreeDVisualization({ items }) {
  // Arrange boxes in a row for simplicity
  let offset = 0;
  const boxes = items.map((item, idx) => {
    const w = item.width / 100;
    const h = item.height / 100;
    const l = item.length / 100;
    const pos = [offset + l / 2, h / 2, 0];
    offset += l + 0.1;
    return (
      <Box
        key={idx}
        position={pos}
        size={[l, h, w]}
        color={colors[idx % colors.length]}
      />
    );
  });

   return (
    <div style={{ width: '100%', height: 100 }}>
      <Canvas>
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <PerspectiveCamera makeDefault position={[3, 3, 6]} />
        <OrbitControls />
        {boxes}
      </Canvas>
    </div>
  );
}

