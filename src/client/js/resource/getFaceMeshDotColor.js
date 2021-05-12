// getFaceMashDotColor.js
const dotsColor = [0.5, 0.5, 0.5];

const getFaceMashDotColor = ({ dotPositions, deformConfig }) => {
  // eslint-disable-next-line no-console
  console.log('deformConfig:', deformConfig);
  return dotPositions.map(() => dotsColor);
};

export default getFaceMashDotColor;
