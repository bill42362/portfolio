// LinearAlgebra.js

export const averageTwoDots = (a, b) => {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
};
export const averageThreeDots = (a, b, c) => {
  return [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, 0.5];
};
export const addTwoVectors = (a, b) => {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
};
export const getPointsVector = ({ origin, target }) => {
  return [target[0] - origin[0], target[1] - origin[1], target[2] - target[2]];
};
export const getVectorLength = ({ vector }) => {
  return Math.sqrt(
    vector[0] * vector[0] + vector[1] * vector[1] + vector[2] * vector[2]
  );
};

export const aDotB2D = ({ a, b }) => a[0] * b[0] + a[1] * b[1];
export const averageTwoDots2D = (a, b) => {
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
};
export const getPointsVector2D = ({ origin, target }) => {
  return [target[0] - origin[0], target[1] - origin[1]];
};
export const getVectorLength2D = ({ vector }) => {
  return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
};

export const moveFromPoint = ({ from, to, ratio }) => {
  const direction = getPointsVector({ origin: from, target: to });
  return [
    from[0] + direction[0] * ratio,
    from[1] + direction[1] * ratio,
    from[2] + direction[2] * ratio,
  ];
};
