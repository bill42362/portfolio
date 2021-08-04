// makeFaceMesh.js
import Delaunator from 'delaunator';

import { shrinkFactor } from '../resource/faceLandmarkVariables.js';
import { getEyeCenters } from '../resource/getFaceMeshTransform.js';

const translateLandmark =
  ({ width, height, shrinkFactor }) =>
  ([x, y]) => {
    return [
      (2 * shrinkFactor * x) / width - 1,
      (-2 * shrinkFactor * y) / height + 1,
      0,
    ];
  };
const vertexToTextCoord = v => [0.5 + v[0] / 2, 0.5 - v[1] / 2];

const makeFaceMesh = ({ landmarks, boundingBox, bitmapSize }) => {
  const translator = translateLandmark({
    width: bitmapSize.width,
    height: bitmapSize.height,
    shrinkFactor,
  });

  const dotPositions = landmarks.map(translator);
  const dotTextCoords = dotPositions.map(vertexToTextCoord);
  const dotColors = dotPositions.map(() => [1, 1, 0]);

  const eyeCenterPositions = getEyeCenters({ dotPositions });
  const eyeCenterTextCoords = {
    left: vertexToTextCoord(eyeCenterPositions.left),
    right: vertexToTextCoord(eyeCenterPositions.right),
  };
  const eyeCenterColors = {
    left: [1, 0, 1],
    right: [1, 0, 1],
  };

  const { topLeft, bottomRight } = boundingBox;
  const boundingBoxPositions = {
    topLeft: translator(topLeft),
    bottomRight: translator(bottomRight),
    topRight: translator([bottomRight[0], topLeft[1]]),
    bottomLeft: translator([topLeft[0], bottomRight[1]]),
  };

  return {
    dots: {
      positions: dotPositions,
      textCoords: dotTextCoords,
      colors: dotColors,
    },
    eyeCenters: {
      left: {
        position: eyeCenterPositions.left,
        textCoord: eyeCenterTextCoords.left,
        color: eyeCenterColors.left,
      },
      right: {
        position: eyeCenterPositions.right,
        textCoord: eyeCenterTextCoords.right,
        color: eyeCenterColors.right,
      },
    },
    boundingBox: {
      topLeft: {
        position: boundingBoxPositions.topLeft,
        textCoord: vertexToTextCoord(boundingBoxPositions.topLeft),
        color: [1, 0.5, 0.5],
      },
      bottomRight: {
        position: boundingBoxPositions.bottomRight,
        textCoord: vertexToTextCoord(boundingBoxPositions.bottomRight),
        color: [1, 0.5, 0.5],
      },
      topRight: {
        position: boundingBoxPositions.topRight,
        textCoord: vertexToTextCoord(boundingBoxPositions.topRight),
        color: [1, 0.5, 0.5],
      },
      bottomLeft: {
        position: boundingBoxPositions.bottomLeft,
        textCoord: vertexToTextCoord(boundingBoxPositions.bottomLeft),
        color: [1, 0.5, 0.5],
      },
    },
  };
};

export const makeFaceMeshTriangles = ({ positions, textCoords, colors }) => {
  // transform list of points [[x, y], [x, y], ...]
  // into triangles composed with point indexes
  // [[1, 2, 3], [2, 3, 4], [3, 4, 5], ...]
  const { triangles } = Delaunator.from(positions);
  let indexGroups = [];
  for (let i = 0; i < triangles.length; i += 3) {
    indexGroups.push([triangles[i], triangles[i + 1], triangles[i + 2]]);
  }

  // transform triangles composed with point indexes
  // into point array
  // [[x, y], [x, y], ...]
  const triangleChunks = indexGroups.flatMap(a => a);
  const trianglePositions = triangleChunks.map(a => positions[a]);
  const triangleTextCoords = triangleChunks.map(a => textCoords[a]);
  const triangleColors = triangleChunks.map(a => colors[a]);

  return {
    trianglePositions,
    triangleTextCoords,
    triangleColors,
    triangleIndexGroups: indexGroups,
  };
};

export default makeFaceMesh;
