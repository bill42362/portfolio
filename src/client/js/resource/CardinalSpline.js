// CardinalSpline.js
// https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Cardinal_spline

const h00 = t => (1 + 2 * t) * (1 - t) * (1 - t);
const h10 = t => t * (1 - t) * (1 - t);
const h01 = t => t * t * (3 - 2 * t);
const h11 = t => t * t * (t - 1);

const mk1 = ({ tension, k0, k2 }) => {
  return ((1 - tension) * (k2.y - k0.y)) / (k2.x - k0.x);
};

const getPolynomial = ({ tension, p0, p1, p2, p3 }) => {
  return t =>
    h00(t) * p1.y +
    h10(t) * mk1({ tension, k0: p0, k2: p2 }) +
    h01(t) * p2.y +
    h11(t) * mk1({ tension, k0: p1, k2: p3 });
};

const getPaddedPoints = ({ points }) => {
  const p0 = points[0];
  const p1 = points[1];
  const ptail0 = points[points.length - 1];
  const ptail1 = points[points.length - 2];
  return [
    { x: p0.x - (p1.x - p0.x), y: p0.y - (p1.y - p0.y) },
    ...points,
    {
      x: ptail0.x + (ptail0.x - ptail1.x),
      y: ptail0.y + (ptail0.y - ptail1.y),
    },
  ];
};

const getPolynomials = ({
  points = [
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ],
  tension = 0.5,
} = {}) => {
  const sortedPoints = points.sort((a, b) => a.x - b.x);
  const padPoints = getPaddedPoints({ points: sortedPoints });
  return sortedPoints.slice(0, -1).reduce((acc, point, index) => {
    return {
      ...acc,
      [point.x]: {
        y: point.y,
        stopPoint: sortedPoints[index + 1].y,
        polynomial: getPolynomial({
          tension,
          p0: padPoints[index],
          p1: padPoints[index + 1],
          p2: padPoints[index + 2],
          p3: padPoints[index + 3],
        }),
      },
    };
  }, {});
};

const getCurvePoint = ({ x, polynomials }) => {
  const startPoints = Object.keys(polynomials);
  const startPointIndex =
    Math.max(
      startPoints.findIndex(p => x < p),
      1
    ) - 1;
  const startPoint = startPoints[startPointIndex];
  if (x == startPoint) {
    return { x, y: polynomials[startPoint].y };
  }
  const polynomial = polynomials[startPoint];
  const t = (x - startPoint) / (polynomial.stopPoint - startPoint);
  return { x, y: polynomials[startPoint].polynomial(t) };
};

export const getCurvePoints = ({
  points = [
    { x: 0, y: 0 },
    { x: 255, y: 255 },
  ],
  tension = 0.5,
} = {}) => {
  const polynomials = getPolynomials({ points, tension });

  return new Array(256).fill(0).map((_, index) => {
    return getCurvePoint({ x: index, polynomials });
  });
};
