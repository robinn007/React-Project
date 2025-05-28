// src/hooks/useContainerPacking.js
import { useCallback } from 'react';
import { containerTypes } from '../utils/containerTypes';
import { calculateItemsFit } from '../utils/packingCalculations';

/**
 * Hook for calculating container packing and visualization data.
 * @param {Object[]} items - Array of items with dimensions, weight, quantity, color
 * @param {string} selectedContainer - Selected container name
 * @returns {Object} Calculation results and visualization data
 */
export const useContainerPacking = (items, selectedContainer) => {
  const calculateLoad = useCallback(() => {
    // Calculate total CBM and weight
    const itemDetails = items.map((item) => {
      const cbm = (item.length * item.width * item.height * item.quantity) / 1_000_000;
      const totalWeight = item.weight * item.quantity;
      return { ...item, cbm: cbm.toFixed(2), totalWeight };
    });

    const totalCBM = itemDetails.reduce((sum, item) => sum + Number(item.cbm), 0);
    const totalWeight = itemDetails.reduce((sum, item) => sum + item.totalWeight, 0);

    let suggestedContainer = null;
    const containerLoadDetails = containerTypes.map((container) => {
      let itemsFitResult = { maxFit: 0, bestOrientation: { l: 0, w: 0, h: 0 } };
      if (items.length === 1) {
        itemsFitResult = calculateItemsFit(
          { length: items[0].length, width: items[0].width, height: items[0].height },
          container.dimensions
        );
      }

      const requiredContainersByVolume = totalCBM > 0 ? Math.ceil(totalCBM / container.cbm) : 0;
      const requiredContainersByWeight = totalWeight > 0 ? Math.ceil(totalWeight / container.weight) : 0;
      const requiredContainers = Math.max(requiredContainersByVolume, requiredContainersByWeight);

      const detail = {
        containerName: container.name,
        containerCBM: container.cbm,
        containerWeight: container.weight,
        maxItemsFitInOneContainer: itemsFitResult.maxFit,
        bestFitOrientation: itemsFitResult.bestOrientation,
        requiredContainers,
      };

      if (
        (!suggestedContainer ||
          (requiredContainers > 0 &&
            container.cbm >= totalCBM &&
            container.weight >= totalWeight &&
            container.cbm < suggestedContainer.cbm)) &&
        requiredContainers === 1
      ) {
        suggestedContainer = { ...container, requiredCount: 1, itemsFitResult };
      }

      return detail;
    });

    // Fallback for multiple containers
    if (!suggestedContainer && totalCBM > 0) {
      const sortedContainers = [...containerTypes].sort((a, b) => a.cbm - b.cbm);
      for (const container of sortedContainers) {
        const requiredContainersByVolume = Math.ceil(totalCBM / container.cbm);
        const requiredContainersByWeight = Math.ceil(totalWeight / container.weight);
        const requiredContainers = Math.max(requiredContainersByVolume, requiredContainersByWeight);
        if (requiredContainers > 0) {
          let itemsFitResult = { maxFit: 0, bestOrientation: { l: 0, w: 0, h: 0 } };
          if (items.length === 1) {
            itemsFitResult = calculateItemsFit(
              { length: items[0].length, width: items[0].width, height: items[0].height },
              container.dimensions
            );
          }
          suggestedContainer = {
            ...container,
            requiredCount: requiredContainers,
            name: `${requiredContainers} x ${container.name}`,
            itemsFitResult,
          };
          break;
        }
      }
    }

    // Generate packed items for visualization
    let packedItems = [];
    let containerDimensions = null;
    if (suggestedContainer && suggestedContainer.dimensions && items.length === 1) {
      const { maxFit, bestOrientation } = suggestedContainer.itemsFitResult;
      const { l: itemL, w: itemW, h: itemH } = bestOrientation;
      containerDimensions = suggestedContainer.dimensions;

      let itemCount = 0;
      for (
        let z = itemH / 2;
        z <= containerDimensions.height - itemH / 2 && itemCount < maxFit;
        z += itemH
      ) {
        for (
          let y = itemW / 2;
          y <= containerDimensions.width - itemW / 2 && itemCount < maxFit;
          y += itemW
        ) {
          for (
            let x = itemL / 2;
            x <= containerDimensions.length - itemL / 2 && itemCount < maxFit;
            x += itemL
          ) {
            packedItems.push({
              position: {
                x: (y - containerDimensions.width / 2) / 100, // Width → x-axis
                y: (z - containerDimensions.height / 2) / 100, // Height → y-axis
                z: (x - containerDimensions.length / 2) / 100, // Length → z-axis
              },
              dimensions: {
                width: itemW / 100,
                height: itemH / 100,
                length: itemL / 100,
              },
              color: items[0].color,
            });
            itemCount++;
          }
        }
      }
    }

    return {
      results: {
        totalCBM: totalCBM.toFixed(2),
        totalWeight,
        suggestedContainer: suggestedContainer || { name: 'No container fits', cbm: 'N/A', dimensions: null },
        itemDetails,
        containerLoadDetails,
      },
      containerDimensions,
      packedItems,
    };
  }, [items, selectedContainer]);

  return { calculateLoad };
};