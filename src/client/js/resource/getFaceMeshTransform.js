// getFaceMeshTransform.js
import { faceLandmarksIndex } from '../resource/faceLandmarkVariables.js';

const averageTwoDots = (a, b) => {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
};
const getPointsVector = ({ origin, target }) => {
  return [target[0] - origin[0], target[1] - origin[1], target[2] - target[2]];
};
const getVectorLength = ({ vector }) => {
  return Math.sqrt(
    vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]
  );
};

/*
const averageTwoDots2D = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const getPointsVector2D = ({ origin, target }) => {
  return [target[0] - origin[0], target[1] - origin[1]];
};
const getVectorLength2D = ({ vector }) => {
  return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
};
*/

const moveFromPoint = ({ from, position, ratio }) => {
  const direction = getPointsVector({ origin: from, target: position });
  return [
    from[0] + direction[0] * ratio,
    from[1] + direction[1] * ratio,
    from[2] + direction[2] * ratio,
  ];
};

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
        position: result[landmarkIndex],
        ratio,
      });
    });
  });
  Object.keys(leftEye.lower).forEach(layer => {
    leftEye.lower[layer].forEach(landmarkIndex => {
      result[landmarkIndex] = moveFromPoint({
        from: eyeCenters.left,
        position: result[landmarkIndex],
        ratio,
      });
    });
  });

  const rightEye = faceLandmarksIndex.rightEye;
  Object.keys(rightEye.upper).forEach(layer => {
    rightEye.upper[layer].forEach(landmarkIndex => {
      result[landmarkIndex] = moveFromPoint({
        from: eyeCenters.right,
        position: result[landmarkIndex],
        ratio,
      });
    });
  });
  Object.keys(rightEye.lower).forEach(layer => {
    rightEye.lower[layer].forEach(landmarkIndex => {
      result[landmarkIndex] = moveFromPoint({
        from: eyeCenters.right,
        position: result[landmarkIndex],
        ratio,
      });
    });
  });

  return result;
};
