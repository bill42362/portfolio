// BeautifyFilter.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import BeautifyFilterCore from '../resource/BeautifyFilter.js';
import ResetButtonStyle from '../style/ResetButtonStyle.js';

const BeautifyFilter = ({ pixelSource }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [maxFps, setMaxFps] = useState(30);
  const [fps, setFps] = useState(0);

  const animationFrame = useRef();
  const lastFrameTimestamp = useRef(0);
  const filterCore = useRef();
  const canvasRef = useRef();

  useEffect(() => {
    filterCore.current = new BeautifyFilterCore();
  }, []);

  useEffect(() => {
    const nextFrame = () => {
      const context = canvasRef.current.getContext('2d');
      if (!context) {
        return;
      }

      let sourceWidth = context.canvas.width;
      let sourceHeight = context.canvas.height;
      if ('VIDEO' == pixelSource.nodeName) {
        sourceWidth = pixelSource.videoWidth;
        sourceHeight = pixelSource.videoHeight;
      } else if ('CANVAS' === pixelSource.nodeName) {
        sourceWidth = pixelSource.width;
        sourceHeight = pixelSource.height;
      }

      if (!sourceWidth || !sourceHeight) {
        return;
      }

      filterCore.current.draw({ pixelSource });

      const canvasWidth = context.canvas.width;
      const canvasHeight = context.canvas.height;
      if (canvasWidth !== sourceWidth || canvasHeight !== sourceHeight) {
        context.canvas.width = sourceWidth;
        context.canvas.height = sourceHeight;
      }

      context.clearRect(0, 0, sourceWidth, sourceHeight);
      context.drawImage(filterCore.current.canvas, 0, 0);
    };

    const animate = timestamp => {
      if (shouldAnimate) {
        animationFrame.current = window.requestAnimationFrame(animate);
      }
      const minInterval = 1000 / maxFps;
      const elapsed = timestamp - lastFrameTimestamp.current;
      if (elapsed >= minInterval) {
        lastFrameTimestamp.current = timestamp;
        nextFrame();
        setFps(Math.ceil(1000 / elapsed));
      }
    };

    if (!shouldAnimate) {
      window.cancelAnimationFrame(animationFrame.current);
      return;
    }

    window.cancelAnimationFrame(animationFrame.current);
    animationFrame.current = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame.current);
  }, [shouldAnimate, maxFps, pixelSource]);

  return (
    <StyledBeautifyFilter>
      <Header>BeautifyFilter</Header>
      <Body>
        <canvas ref={canvasRef} />
      </Body>
      <Footer>
        <DrawButton
          isActived={shouldAnimate}
          disabled={!pixelSource}
          onClick={() => setShouldAnimate(!shouldAnimate)}
        >
          Draw
        </DrawButton>
        <span>FPS: {fps}</span>
        <Controls>
          <Label>
            <span>Max FPS: {maxFps}</span>
            <input
              type="range"
              min="1"
              max="60"
              step="1"
              value={maxFps}
              onChange={e => setMaxFps(e.target.value)}
            />
          </Label>
        </Controls>
      </Footer>
    </StyledBeautifyFilter>
  );
};

BeautifyFilter.propTypes = {
  pixelSource: PropTypes.object,
};

BeautifyFilter.defaultProps = {
  pixelSource: null,
};

const StyledBeautifyFilter = styled.div`
  border: solid 1px #4834d4;
  border-radius: 8px;
  overflow: hidden;
`;

const Header = styled.div`
  background-color: #4834d4;
  padding: 8px;
`;

const Body = styled.div`
  position: relative;
  background-color: #686de0;
  padding: 8px;
  & > canvas {
    width: 100%;
  }
`;

const Button = styled.button`
  ${ResetButtonStyle}
  border-radius: 4px;
  padding: 4px;
  color: white;
  font-size: 14px;
  & + & {
    margin-left: 8px;
  }
`;

const Footer = styled.div`
  background-color: #4834d4;
  padding: 8px;
  button + span {
    margin-left: 8px;
  }
`;

const DrawButton = styled(Button).attrs(({ isActived }) => {
  return {
    style: {
      backgroundColor: isActived ? '#6ab04c' : '#badc58',
    },
  };
})``;

const Controls = styled.div`
  margin-top: 8px;
`;

const Label = styled.label`
  display: flex;

  input {
    flex: 1;
    margin-left: 8px;
  }
`;

export default BeautifyFilter;
