// ToneCurveEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getCurvePoints } from '../resource/CardinalSpline.js';

const SIZE = 256;

const drawAxis = context => {
  const originStrokeStyle = context.strokeStyle;
  context.strokeStyle = 'darkgray';
  const originLineWidth = context.lineWidth;
  context.lineWidth = 0.5;
  context.beginPath();
  for (let i = 50; i < SIZE; i = i + 50) {
    context.moveTo(i, 0);
    context.lineTo(i, SIZE);
    context.moveTo(0, SIZE - i);
    context.lineTo(SIZE, SIZE - i);
  }
  context.stroke();
  context.strokeStyle = originStrokeStyle;
  context.lineWidth = originLineWidth;
};

const drawCross = (context, point, size = 10) => {
  const originLineWidth = context.lineWidth;
  const originStrokeStyle = context.strokeStyle;
  const axisPoint = { x: point.x, y: SIZE - point.y };
  context.strokeStyle = '#f6e58d';
  context.lineWidth = 0.5;
  context.beginPath();
  context.moveTo(axisPoint.x, axisPoint.y - size);
  context.lineTo(axisPoint.x, axisPoint.y + size);
  context.moveTo(axisPoint.x - size, axisPoint.y);
  context.lineTo(axisPoint.x + size, axisPoint.y);
  context.stroke();
  context.strokeStyle = originStrokeStyle;
  context.lineWidth = originLineWidth;
};

const ToneCurveEditor = ({ onChange }) => {
  const [cursorPoint, setCursorPoint] = useState();
  const [tension, setTension] = useState(0);
  const [redControlPoints] = useState([
    { x: 0, y: 0 },
    // { x: 120, y: 146 },
    { x: 120, y: 186 },
    { x: 255, y: 255 },
  ]);
  const [redCurvePoints, setRedCurvePoints] = useState([]);
  const canvas = useRef();

  useEffect(() => {
    const redCurvePoints = getCurvePoints({
      tension,
      points: redControlPoints,
    });
    setRedCurvePoints(redCurvePoints);
    onChange({
      red: redCurvePoints,
      green: redCurvePoints,
      blue: redCurvePoints,
    });
  }, [tension, redControlPoints, onChange]);

  useEffect(() => {
    const context = canvas.current.getContext('2d');
    context.clearRect(0, 0, SIZE, SIZE);

    drawAxis(context);
    cursorPoint && drawCross(context, cursorPoint);

    context.strokeStyle = 'red';
    context.beginPath();
    context.moveTo(0, SIZE);
    redCurvePoints.forEach(point => {
      context.lineTo(point.x, SIZE - point.y);
    });
    context.stroke();

    context.fillStyle = 'red';
    redControlPoints.forEach(point => {
      context.beginPath();
      context.arc(point.x, SIZE - point.y, 2, 0, 2 * Math.PI);
      context.fill();
    });
  }, [redControlPoints, redCurvePoints, cursorPoint]);

  const handleOnMouseMove = e => {
    const x = e.clientX - e.target.offsetLeft;
    const y = SIZE - e.clientY + e.target.offsetTop;
    setCursorPoint({ x, y });
  };

  return (
    <StyledToneCurveEditor>
      <Monitor
        width={SIZE}
        height={SIZE}
        ref={canvas}
        onMouseMove={handleOnMouseMove}
        onMouseLeave={() => setCursorPoint()}
      />
      <Controls>
        <Label>
          <span>Tension: {tension}</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={tension}
            onChange={e => setTension(e.target.value)}
          />
        </Label>
      </Controls>
    </StyledToneCurveEditor>
  );
};

ToneCurveEditor.propTypes = {
  onChange: PropTypes.func,
};

ToneCurveEditor.defaultProps = {
  onChange: () => null,
};

const StyledToneCurveEditor = styled.div`
  display: flex;
`;

const Monitor = styled.canvas`
  background-color: black;
`;

const Controls = styled.div`
  margin-left: 8px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  span {
    display: block;
  }
  input {
    width: 100%;
  }
`;

export default ToneCurveEditor;
