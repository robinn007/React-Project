import React from 'react';
import { Table } from '../common/Table';
import { Button } from '../common/Button';

export const ResultsDisplay = ({ results, showVisualization, onToggleVisualization }) => {
  const itemHeaders = ['Item', 'Dimensions (cm)', 'Weight (kg)', 'Quantity', 'CBM', 'Total Weight'];
  const containerHeaders = ['Container Type', 'Max Items Fit (Our Algo)', 'Best Orientation (L×W×H)', 'Required Containers'];

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Calculation Results</h2>
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total CBM</p>
            <p className="text-2xl font-bold text-blue-600">{results.totalCBM} m³</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm">
            <p className="text-sm font-medium text-gray-500">Total Weight</p>
            <p className="text-2xl font-bold text-blue-600">{results.totalWeight} kg</p>
          </div>
          <div className="bg-white p-3 rounded-md shadow-sm sm:col-span-2">
            <p className="text-sm font-medium text-gray-500">Suggested Container</p>
            <p className="text-xl font-bold text-blue-600">{results.suggestedContainer.name}</p>
            {results.suggestedContainer.cbm !== 'N/A' && (
              <p className="text-sm text-gray-600 mt-1">
                Utilization: {((results.totalCBM / results.suggestedContainer.cbm) * 100).toFixed(1)}%
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Item Details</h3>
        <Table
          headers={itemHeaders}
          data={results.itemDetails}
          renderRow={(item, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.length} × {item.width} × {item.height}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.weight}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.cbm}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.totalWeight}</td>
            </tr>
          )}
        />
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Packing Analysis (Per Container Type)</h3>
        <Table
          headers={containerHeaders}
          data={results.containerLoadDetails}
          renderRow={(detail, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{detail.containerName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {results.itemDetails.length === 1 ? detail.maxItemsFitInOneContainer : 'N/A (multiple item types)'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {results.itemDetails.length === 1 && detail.bestFitOrientation.l > 0
                  ? `${detail.bestFitOrientation.l}×${detail.bestFitOrientation.w}×${detail.bestFitOrientation.h}`
                  : 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{detail.requiredContainers}</td>
            </tr>
          )}
        />
        <p className="mt-2 text-sm text-gray-500 italic">
          "Max Items Fit" is calculated using a greedy packing algorithm for a single item type.
        </p>
      </div>
      <Button onClick={onToggleVisualization} className="bg-purple-600 hover:bg-purple-700">
        {showVisualization ? 'Hide 3D Visualization' : 'Show 3D Visualization'}
      </Button>
    </div>
  );
};