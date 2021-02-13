// ToneCurveEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { getCurvePoints } from '../resource/CardinalSpline.js';

const ToneCurveEditor = ({ onChange }) => {
  const [tension, setTension] = useState(0.5);
  const [redControlPoints] = useState([
    { x: 0, y: 0 },
    { x: 120, y: 146 },
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
    onChange({ red: redCurvePoints });
  }, [tension, redControlPoints, onChange]);

  useEffect(() => {
    const context = canvas.current.getContext('2d');
    context.clearRect(0, 0, 256, 256);
    context.strokeStyle = 'red';
    context.beginPath();
    context.moveTo(0, 255);
    redCurvePoints.forEach(point => {
      context.lineTo(point.x, 255 - point.y);
    });
    context.stroke();

    context.fillStyle = 'red';
    redControlPoints.forEach(point => {
      context.beginPath();
      context.arc(point.x, 255 - point.y, 2, 0, 2 * Math.PI);
      context.fill();
    });
  }, [redControlPoints, redCurvePoints]);

  return (
    <StyledToneCurveEditor>
      <Monitor width="256" height="256" ref={canvas} />
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
