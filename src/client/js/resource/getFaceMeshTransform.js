// getFaceMeshTransform.js
import faceLandmarksIndex from '../resource/faceLandmarksIndex.js';

const averageTwoDots = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0.5];
const getPointDistance = ({ origin, target }) => {
  return [target[0] - origin[0], target[1] - origin[1], target[2] - target[2]];
};

const moveFromPoint = ({ from, position, ratio }) => {
  const direction = getPointDistance({ origin: from, target: position });
  return [
    from[0] + direction[0] * ratio,
    from[1] + direction[1] * ratio,
    from[2] + direction[2] * ratio,
  ];
};

export const getEnlargeEyes = ({ dotPositions, ratio }) => {
  const result = dotPositions.map(p => [...p]);

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
  Object.keys(leftEye.upper).forEach(layer => {
    leftEye.upper[layer].forEach(landmarkIndex => {
      result[landmarkIndex] = moveFromPoint({
        from: leftEyeCenter,
        position: result[landmarkIndex],
        ratio,
      });
    });
  });
  Object.keys(leftEye.lower).forEach(layer => {
    leftEye.lower[layer].forEach(landmarkIndex => {
      result[landmarkIndex] = moveFromPoint({
        from: leftEyeCenter,
        position: result[landmarkIndex],
        ratio,
      });
    });
  });

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
  Object.keys(rightEye.upper).forEach(layer => {
    rightEye.upper[layer].forEach(landmarkIndex => {
      result[landmarkIndex] = moveFromPoint({
        from: rightEyeCenter,
        position: result[landmarkIndex],
        ratio,
      });
    });
  });
  Object.keys(rightEye.lower).forEach(layer => {
    rightEye.lower[layer].forEach(landmarkIndex => {
      result[landmarkIndex] = moveFromPoint({
        from: rightEyeCenter,
        position: result[landmarkIndex],
        ratio,
      });
    });
  });

  return result;
};
