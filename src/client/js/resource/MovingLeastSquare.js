// MovingLeastSquare.js
// SCHAEFER, S., MCPHAIL, T., AND WARREN, J. 2006. Image deformation using moving least squares. In SIGGRAPH ’06: ACM SIGGRAPH 2006 Papers, ACM Press, New York, NY, USA, 533–540.
// https://people.engr.tamu.edu/schaefer/research/mls.pdf

import {
  getPointsVector2D,
  getVectorLength2D,
} from '../resource/getFaceMeshTransform.js';

const aDotB2D = ({ a, b }) => a[0] * b[0] + a[1] * b[1];

const getMovingLeastSquareMesh = ({
  pointPairs = [],
  stripCount = 3,
  alpha = 1,
} = {}) => {
  const lineCount = stripCount + 1;
  const step = 1 / stripCount;
  const points = new Array(lineCount * lineCount).fill(0).map((_, index) => {
    const xIndex = index % lineCount;
    const yIndex = Math.floor(index / lineCount);
    const textCoord = [step * xIndex, step * yIndex];

    const weights = pointPairs.map(({ origin }) => {
      return (
        1 /
        Math.pow(
          getVectorLength2D({
            vector: getPointsVector2D({
              origin: textCoord,
              target: origin,
            }),
          }) || 1e-100,
          2 * alpha
        )
      );
    });

    const weightsSum = weights.reduce((cur, w) => cur + w, 0);

    const pStar = pointPairs.reduce(
      (cur, p, index) => {
        return [
          cur[0] + (weights[index] * p.origin[0]) / weightsSum,
          cur[1] + (weights[index] * p.origin[1]) / weightsSum,
        ];
      },
      [0, 0]
    );
    const qStar = pointPairs.reduce(
      (cur, p, index) => {
        return [
          cur[0] + (weights[index] * p.target[0]) / weightsSum,
          cur[1] + (weights[index] * p.target[1]) / weightsSum,
        ];
      },
      [0, 0]
    );
    const normalVector = getPointsVector2D({
      origin: pStar,
      target: textCoord,
    });
    const normalDistance = getVectorLength2D({ vector: normalVector });

    const pHats = pointPairs.map(p =>
      getPointsVector2D({
        origin: pStar,
        target: p.origin,
      })
    );
    const qHats = pointPairs.map(p =>
      getPointsVector2D({
        origin: qStar,
        target: p.target,
      })
    );

    const As = weights.map((w, index) => {
      const pHat = pHats[index];
      const minusPHatOrth = [pHat[1], -pHat[0]];
      const minusNormalVectorOrth = [normalVector[1], -normalVector[0]];
      return [
        w * aDotB2D({ a: pHat, b: normalVector }),
        w * aDotB2D({ a: pHat, b: minusNormalVectorOrth }),
        w * aDotB2D({ a: minusPHatOrth, b: normalVector }),
        w * aDotB2D({ a: minusPHatOrth, b: minusNormalVectorOrth }),
      ];
    });

    const fvVector = qHats.reduce(
      (cur, qHat, index) => {
        const A = As[index];
        return [
          cur[0] + qHat[0] * A[0] + qHat[1] * A[2],
          cur[1] + qHat[0] * A[1] + qHat[1] * A[3],
        ];
      },
      [0, 0]
    );

    const fvLength = getVectorLength2D({ vector: fvVector }) || 1e-100;

    const newTextCoord = [
      (normalDistance * fvVector[0]) / fvLength + qStar[0],
      (normalDistance * fvVector[1]) / fvLength + qStar[1],
    ];

    const position = [
      2 * (newTextCoord[0] - 0.5),
      -2 * (newTextCoord[1] - 0.5),
      0,
    ];

    return { textCoord, newTextCoord, position, index: [xIndex, yIndex] };
  });

  const elementIndexes = [];
  points.forEach((point, index) => {
    if (point.index.includes(stripCount)) {
      // right or bottom edge
      return;
    }
    elementIndexes.push(
      index,
      index + 1,
      index + lineCount + 1,
      index,
      index + lineCount + 1,
      index + lineCount
    );
  });

  return {
    positions: points.map(p => p.position).flatMap(a => a),
    textCoords: points.map(p => p.textCoord).flatMap(a => a),
    colors: points.map(() => [1, 0.5, 0]).flatMap(a => a),
    elementIndexes,
  };
};

export const edgeAnchorPointPairs = [
  { origin: [0, 0], target: [0, 0] },
  { origin: [0, 0.25], target: [0, 0.25] },
  { origin: [0, 0.5], target: [0, 0.5] },
  { origin: [0, 0.75], target: [0, 0.75] },
  { origin: [0, 1], target: [0, 1] },
  { origin: [0.25, 0], target: [0.25, 0] },
  { origin: [0.5, 0], target: [0.5, 0] },
  { origin: [0.75, 0], target: [0.75, 0] },
  { origin: [0.25, 1], target: [0.25, 1] },
  { origin: [0.5, 1], target: [0.5, 1] },
  { origin: [0.75, 1], target: [0.75, 1] },
  { origin: [1, 0], target: [1, 0] },
  { origin: [1, 0.25], target: [1, 0.25] },
  { origin: [1, 0.5], target: [1, 0.5] },
  { origin: [1, 0.75], target: [1, 0.75] },
  { origin: [1, 1], target: [1, 1] },
];

export default getMovingLeastSquareMesh;
