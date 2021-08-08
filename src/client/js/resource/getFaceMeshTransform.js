// getFaceMeshTransform.js
import {
  averageTwoDots,
  getPointsVector,
  getVectorLength,
  moveFromPoint,
} from '../resource/LinearAlgebra.js';
import { faceLandmarksIndex } from '../resource/faceLandmarkVariables.js';

export const getEyeRadiuses = ({ dotPositions }) => {
  const eyeCenters = getEyeCenters({ dotPositions });
  const leftEye = faceLandmarksIndex.leftEye;
  const rightEye = faceLandmarksIndex.rightEye;
  const leftEyeVector = getPointsVector({
    origin: eyeCenters.left,
    target: dotPositions[leftEye.lower.outer[0]],
  });
  const rightEyeVector = getPointsVector({
    origin: eyeCenters.right,
    target: dotPositions[rightEye.lower.outer[0]],
  });
  return {
    left: getVectorLength({ vector: leftEyeVector }),
    right: getVectorLength({ vector: rightEyeVector }),
  };
};

export const getEyeCenters = ({ dotPositions }) => {
  const leftEye = faceLandmarksIndex.leftEye;
  const leftEyeCenter = averageTwoDots(
    averageTwoDots(
      dotPositions[leftEye.upper.inner[2]],
      dotPositions[leftEye.upper.inner[4]]
    ),
    averageTwoDots(
      dotPositions[leftEye.lower.inner[3]],
      dotPositions[leftEye.lower.inner[5]]
    )
  );
  const rightEye = faceLandmarksIndex.rightEye;
  const rightEyeCenter = averageTwoDots(
    averageTwoDots(
      dotPositions[rightEye.upper.inner[2]],
      dotPositions[rightEye.upper.inner[4]]
    ),
    averageTwoDots(
      dotPositions[rightEye.lower.inner[3]],
      dotPositions[rightEye.lower.inner[5]]
    )
  );

  return { left: leftEyeCenter, right: rightEyeCenter };
};

export const getEnlargeEyes = ({ dotPositions, ratio }) => {
  const result = dotPositions.map(p => [...p]);

  const eyeCenters = getEyeCenters({ dotPositions });

  const leftEye = faceLandmarksIndex.leftEye;
  Object.keys(leftEye.upper).forEach(layer => {
    leftEye.upper[layer].forEach(landmarkIndex => {
      result[landmarkIndex] = moveFromPoint({
        from: eyeCenters.left,
        to: result[landmarkIndex],
        ratio,
      });
    });
  });
  Object.keys(leftEye.lower).forEach(layer => {
    leftEye.lower[layer].forEach(landmarkIndex => {
      result[landmarkIndex] = moveFromPoint({
        from: eyeCenters.left,
        to: result[landmarkIndex],
        ratio,
      });
    });
  });

  const rightEye = faceLandmarksIndex.rightEye;
  Object.keys(rightEye.upper).forEach(layer => {
    rightEye.upper[layer].forEach(landmarkIndex => {
      result[landmarkIndex] = moveFromPoint({
        from: eyeCenters.right,
        to: result[landmarkIndex],
        ratio,
      });
    });
  });
  Object.keys(rightEye.lower).forEach(layer => {
    rightEye.lower[layer].forEach(landmarkIndex => {
      result[landmarkIndex] = moveFromPoint({
        from: eyeCenters.right,
        to: result[landmarkIndex],
        ratio,
      });
    });
  });

  return result;
};

const cheekIndexs = faceLandmarksIndex.cheek;
const noseCenterIndexs = faceLandmarksIndex.nose.center;
export const cheekSizeIndexPairs = [
  { origin: cheekIndexs.left.inner[9], target: noseCenterIndexs[8] },
  { origin: cheekIndexs.left.inner[8], target: noseCenterIndexs[8] },
  { origin: cheekIndexs.left.inner[7], target: noseCenterIndexs[6] },
  { origin: cheekIndexs.left.inner[6], target: noseCenterIndexs[6] },
  { origin: cheekIndexs.left.inner[5], target: noseCenterIndexs[4] },
  { origin: cheekIndexs.left.inner[4], target: noseCenterIndexs[4] },
  { origin: cheekIndexs.left.inner[3], target: noseCenterIndexs[0] },
  { origin: cheekIndexs.left.inner[2], target: noseCenterIndexs[0] },
  { origin: cheekIndexs.left.inner[1], target: noseCenterIndexs[0] },
  //{ origin: faceLandmarksIndex.chin.inner, target: noseCenterIndexs[0] },
  { origin: cheekIndexs.right.inner[9], target: noseCenterIndexs[8] },
  { origin: cheekIndexs.right.inner[8], target: noseCenterIndexs[8] },
  { origin: cheekIndexs.right.inner[7], target: noseCenterIndexs[6] },
  { origin: cheekIndexs.right.inner[6], target: noseCenterIndexs[6] },
  { origin: cheekIndexs.right.inner[5], target: noseCenterIndexs[4] },
  { origin: cheekIndexs.right.inner[4], target: noseCenterIndexs[4] },
  { origin: cheekIndexs.right.inner[3], target: noseCenterIndexs[0] },
  { origin: cheekIndexs.right.inner[2], target: noseCenterIndexs[0] },
  { origin: cheekIndexs.right.inner[1], target: noseCenterIndexs[0] },
];

export const edgePointsMesh = {
  // z ⊃ [-1, 1] -> farthest: 1
  positions: [
    [-1, -1, 1],
    [0, -1, 1],
    [1, -1, 1],
    [-1, 0, 1],
    [1, 0, 1],
    [-1, 1, 1],
    [0, 1, 1],
    [1, 1, 1],
  ],
  textCoords: [
    [0, 1],
    [0.5, 1],
    [1, 1],
    [0, 0.5],
    [1, 0.5],
    [0, 0],
    [0.5, 0],
    [1, 0],
  ],
  colors: [
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 1],
    [0, 1, 1],
  ],
};
