// src/utils/packingCalculations.js

/**
 * Calculates the number of items that fit in a container for a single orientation.
 * @param {number} itemL - Item length (cm)
 * @param {number} itemW - Item width (cm)
 * @param {number} itemH - Item height (cm)
 * @param {number} containerL - Container length (cm)
 * @param {number} containerW - Container width (cm)
 * @param {number} containerH - Container height (cm)
 * @returns {number} Number of items that fit
 */
export const calculateItemsFitInOneOrientation = (itemL, itemW, itemH, containerL, containerW, containerH) => {
  if (itemL <= 0 || itemW <= 0 || itemH <= 0 || containerL <= 0 || containerW <= 0 || containerH <= 0) {
    return 0;
  }

  let fitCount = 0;
  let currentZ = 0;

  while (currentZ + itemH <= containerH) {
    let currentY = 0;
    while (currentY + itemW <= containerW) {
      let currentX = 0;
      while (currentX + itemL <= containerL) {
        fitCount++;
        currentX += itemL;
      }
      currentY += itemW;
    }
    currentZ += itemH;
  }
  return fitCount;
};

/**
 * Calculates the maximum number of items that fit in a container, considering all orientations.
 * @param {Object} itemDim - Item dimensions { length, width, height } in cm
 * @param {Object} containerDim - Container dimensions { length, width, height } in cm
 * @returns {Object} { maxFit, bestOrientation }
 */
export const calculateItemsFit = (itemDim, containerDim) => {
  const { length: originalL, width: originalW, height: originalH } = itemDim;
  const { length: containerL, width: containerW, height: containerH } = containerDim;

  let maxFit = 0;
  let bestOrientation = { l: originalL, w: originalW, h: originalH };

  const orientations = [
    { l: originalL, w: originalW, h: originalH },
    { l: originalL, w: originalH, h: originalW },
    { l: originalW, w: originalL, h: originalH },
    { l: originalW, w: originalH, h: originalL },
    { l: originalH, w: originalL, h: originalW },
    { l: originalH, w: originalW, h: originalL },
  ];

  orientations.forEach((orientation) => {
    const currentFit = calculateItemsFitInOneOrientation(
      orientation.l,
      orientation.w,
      orientation.h,
      containerL,
      containerW,
      containerH
    );
    if (currentFit > maxFit) {
      maxFit = currentFit;
      bestOrientation = orientation;
    }
  });

  return { maxFit, bestOrientation };
};