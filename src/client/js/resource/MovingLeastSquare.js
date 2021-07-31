// MovingLeastSquare.js
import {
  getPointsVector2D,
  getVectorLength2D,
} from '../resource/getFaceMeshTransform.js';

const STRIP_COUNT = 3;
const STEP = 1 / STRIP_COUNT;
const LINE_COUNT = STRIP_COUNT + 1;

const aDotB2D = ({ a, b }) => a[0] * b[0] + a[1] * b[1];

const getMovingLeastSquareMesh = ({ pointPairs = [], alpha = 1 } = {}) => {
  const points = new Array(LINE_COUNT * LINE_COUNT).fill(0).map((_, index) => {
    const xIndex = index % LINE_COUNT;
    const yIndex = Math.floor(index / LINE_COUNT);
    const textCoord = [STEP * xIndex, STEP * yIndex];

    const weights = pointPairs.map(({ origin }) => {
      return (
        1 /
        Math.pow(
          getVectorLength2D({
            vector: getPointsVector2D({
              origin: textCoord,
              target: origin,
            }),
          }),
          2 * alpha
        )
      );
    });

    const weightsSum = weights.reduce((cur, w) => cur + w, 0);

    const pStar = pointPairs.reduce(
      (cur, p) => {
        return [
          (cur[0] + p.origin[0]) / weightsSum,
          (cur[1] + p.origin[1]) / weightsSum,
        ];
      },
      [0, 0]
    );
    const qStar = pointPairs.reduce(
      (cur, p) => {
        return [
          (cur[0] + p.target[0]) / weightsSum,
          (cur[1] + p.target[1]) / weightsSum,
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

    const fvLength = getVectorLength2D({ vector: fvVector });

    const newTextCoord = [
      (normalDistance * fvVector[0]) / fvLength + qStar[0],
      (normalDistance * fvVector[1]) / fvLength + qStar[1],
    ];

    const position = [2 * (newTextCoord[0] - 0.5), 2 * (newTextCoord[1] - 0.5), 0];

    return { textCoord, newTextCoord, position, index: [xIndex, yIndex] };
  });

  const elementIndexs = [];
  points.forEach((point, index) => {
    if (point.index.includes(STRIP_COUNT)) {
      // right or bottom edge
      return;
    }
    elementIndexs.push(
      index,
      index + 1,
      index + LINE_COUNT + 1,
      index,
      index + LINE_COUNT + 1,
      index + LINE_COUNT
    );
  });

  return {
    positions: points.map(p => p.position).flatMap(a => a),
    textCoords: points.map(p => p.textCoord).flatMap(a => a),
    elementIndexs,
  };
};

export default getMovingLeastSquareMesh;
