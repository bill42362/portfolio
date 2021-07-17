// getFaceMashDotColor.js
const dotsDefaultColor = [0.5, 0.5, 0.5];

const averageTwoDots = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 0.5];
const averageThreeDots = (a, b, c) => {
  return [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, 0.5];
};
const getPointDistance = ({ origin, target }) => {
  return [target[0] - origin[0], target[1] - origin[1], target[2] - target[2]];
};

const mapEyeIndexesWithCenterCoords =
  ({ eyesEnlargeRatio, dotPositions }) =>
  ({ eyeIndexes, centerCoords, centerCoordsOffset }) => {
    return eyeIndexes.map((dotIndex, index) => {
      const distance = getPointDistance({
        origin: dotPositions[dotIndex],
        target: centerCoords[index + centerCoordsOffset],
      });
      return {
        dotIndex,
        color: [
          // *10 is for increase precision
          0.5 + 10 * distance[0] * eyesEnlargeRatio,
          0.5 + 10 * distance[1] * eyesEnlargeRatio,
          0.5 + 10 * distance[2] * eyesEnlargeRatio,
        ],
      };
    });
  };

const getFaceMashDotColor = ({ dotPositions, deformConfig }) => {
  const result = dotPositions.map(() => dotsDefaultColor);

  const leftEyeUpper0Indexes = [398, 384, 385, 386, 387, 388, 466]; // inner
  const leftEyeUpper1Indexes = [414, 286, 258, 257, 259, 260, 467]; // middle
  // const leftEyeUpper2Indexes = [413, 441, 442, 443, 444, 445, 342]; // outer
  const leftEyeLower0Indexes = [362, 382, 381, 380, 374, 373, 390, 249, 263]; // inner
  const leftEyeLower1Indexes = [463, 341, 256, 252, 253, 254, 339, 255, 359]; // middle
  // const leftEyeLower2Indexes = [464, 453, 452, 451, 450, 449, 448, 261, 446]; // outer

  const rightEyeUpper0Indexes = [173, 157, 158, 159, 160, 161, 246]; // inner
  const rightEyeUpper1Indexes = [190, 56, 28, 27, 29, 30, 247]; // middle
  // const rightEyeUpper2Indexes = [189, 221, 222, 223, 224, 225, 113]; // outer
  const rightEyeLower0Indexes = [133, 155, 154, 153, 145, 144, 163, 7, 33]; // inner
  const rightEyeLower1Indexes = [243, 112, 26, 22, 23, 24, 110, 25, 130]; // middle
  // const rightEyeLower2Indexes = [244, 233, 232, 231, 230, 229, 228, 31, 226]; // outer

  // enlarge face
  const leftEyeCenterCoords = [];
  leftEyeCenterCoords.push(
    averageThreeDots(dotPositions[384], dotPositions[381], dotPositions[362])
  );
  leftEyeUpper0Indexes.forEach((upperIndex, index) => {
    const upperCoord = dotPositions[upperIndex];
    const lowerCoord = dotPositions[leftEyeLower0Indexes[index + 1]];
    leftEyeCenterCoords.push(averageTwoDots(upperCoord, lowerCoord));
  });
  leftEyeCenterCoords.push(
    averageThreeDots(dotPositions[388], dotPositions[390], dotPositions[263])
  );

  const rightEyeCenterCoords = [];
  rightEyeCenterCoords.push(
    averageThreeDots(dotPositions[157], dotPositions[154], dotPositions[133])
  );
  rightEyeUpper0Indexes.forEach((upperIndex, index) => {
    const upperCoord = dotPositions[upperIndex];
    const lowerCoord = dotPositions[rightEyeLower0Indexes[index + 1]];
    rightEyeCenterCoords.push(averageTwoDots(upperCoord, lowerCoord));
  });
  rightEyeCenterCoords.push(
    averageThreeDots(dotPositions[161], dotPositions[163], dotPositions[33])
  );

  const eyesEnlargeRatio = deformConfig.eyesEnlarge - 1;
  const eyeColorMaps = [
    {
      eyeIndexes: leftEyeUpper0Indexes,
      centerCoords: leftEyeCenterCoords,
      centerCoordsOffset: 1, // upper line only have 7 dots
    },
    {
      eyeIndexes: leftEyeUpper1Indexes,
      centerCoords: leftEyeCenterCoords,
      centerCoordsOffset: 1, // upper line only have 7 dots
    },
    {
      eyeIndexes: leftEyeLower0Indexes,
      centerCoords: leftEyeCenterCoords,
      centerCoordsOffset: 0,
    },
    {
      eyeIndexes: leftEyeLower1Indexes,
      centerCoords: leftEyeCenterCoords,
      centerCoordsOffset: 0,
    },
    {
      eyeIndexes: rightEyeUpper0Indexes,
      centerCoords: rightEyeCenterCoords,
      centerCoordsOffset: 1, // upper line only have 7 dots
    },
    {
      eyeIndexes: rightEyeUpper1Indexes,
      centerCoords: rightEyeCenterCoords,
      centerCoordsOffset: 1, // upper line only have 7 dots
    },
    {
      eyeIndexes: rightEyeLower0Indexes,
      centerCoords: rightEyeCenterCoords,
      centerCoordsOffset: 0,
    },
    {
      eyeIndexes: rightEyeLower1Indexes,
      centerCoords: rightEyeCenterCoords,
      centerCoordsOffset: 0,
    },
  ]
    .map(mapEyeIndexesWithCenterCoords({ eyesEnlargeRatio, dotPositions }))
    .flatMap(a => a);
  eyeColorMaps.forEach(eyeColorMap => {
    result[eyeColorMap.dotIndex] = eyeColorMap.color;
  });

  return result;
};

export default getFaceMashDotColor;
