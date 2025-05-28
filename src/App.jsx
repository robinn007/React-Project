// src/App.jsx
import React, { useState, useEffect } from 'react';
import { useContainerPacking } from './hooks/useContainerPacking';
import { Header } from './components/layout/Header';
import { Container } from './components/layout/Container';
import { CargoInput } from './components/calculator/CargoInput';
import { ResultsDisplay } from './components/calculator/ResultsDisplay';
import { Visualization } from './components/calculator/Visualization';
import { RegistrationForm } from './components/calculator/RegistrationForm';
//import { AddProductForm } from './components/calculator/AddProductForm';

/**
 * Main application component.
 */
export default function App() {
  const [items, setItems] = useState([
    { length: 200, width: 150, height: 150, weight: 100, quantity: 1, color: '#FF5733' },
  ]);
  const [selectedContainer, setSelectedContainer] = useState('');
  const [results, setResults] = useState(null);
  const [showVisualization, setShowVisualization] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [containerDimensions, setContainerDimensions] = useState(null);
  const [packedItems, setPackedItems] = useState([]);
  const { calculateLoad } = useContainerPacking(items, selectedContainer);

  useEffect(() => {
    if (items.length > 0) {
      const { results, containerDimensions, packedItems } = calculateLoad();
      setResults(results);
      setContainerDimensions(containerDimensions);
      setPackedItems(packedItems);
    }
  }, [items, selectedContainer, calculateLoad]);

  const handleInputChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = Number(value);
    setItems(newItems);
  };

  const addItem = () => {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3', '#FF8C00', '#8A2BE2', '#00CED1'];
    setItems([
      ...items,
      {
        length: 100,
        width: 50,
        height: 50,
        weight: 100,
        quantity: 1,
        color: colors[items.length % colors.length],
      },
    ]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const resetCalculator = () => {
    setItems([{ length: 200, width: 150, height: 150, weight: 100, quantity: 1, color: '#FF5733' }]);
    setSelectedContainer('');
    setResults(null);
    setShowVisualization(false);
    setShowRegistrationForm(false);
    setContainerDimensions(null);
    setPackedItems([]);
  };

  const handleToggleVisualization = () => {
    if (showVisualization) {
      setShowVisualization(false);
    } else {
      setShowRegistrationForm(true);
    }
  };

  const handleRegistrationSuccess = () => {
    setShowRegistrationForm(false);
    setShowVisualization(true);
  };

  const handleRegistrationCancel = () => {
    setShowRegistrationForm(false);
    setShowVisualization(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Container>
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CargoInput
            items={items}
            selectedContainer={selectedContainer}
            onInputChange={handleInputChange}
            onAddItem={addItem}
            onRemoveItem={removeItem}
            onContainerChange={(e) => setSelectedContainer(e.target.value)}
            onCalculate={calculateLoad}
            onReset={resetCalculator}
          />
          {results && (
            <ResultsDisplay
              results={results}
              showVisualization={showVisualization}
              onToggleVisualization={handleToggleVisualization}
            />
          )}
        </div>
        {showRegistrationForm && (
          <RegistrationForm
            onRegisterSuccess={handleRegistrationSuccess}
            onCancel={handleRegistrationCancel}
          />
        )}
        {showVisualization && containerDimensions && packedItems.length > 0 && (
          <Visualization
            containerDimensions={containerDimensions}
            packedItems={packedItems}
          />
        )}
       
      </Container>
    </div>
  );
}