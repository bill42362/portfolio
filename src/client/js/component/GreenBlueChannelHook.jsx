// GreenBlueChannelHook.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ResetButtonStyle from '../style/ResetButtonStyle.js';

const vertexShaderSource = `#version 300 es
in vec4 aPosition;
in vec2 aTextCoord;
out vec2 vTextCoord;

void main() {
  gl_Position = aPosition;
  vTextCoord = aTextCoord;
}
`;
const fragmentShaderSource = `#version 300 es
precision highp float;

uniform sampler2D uSource;
in vec2 vTextCoord;

out vec4 outColor;

void main() {
  vec4 originColor = texture(uSource, vTextCoord);
  float gbColor = 2.0 * originColor.b * originColor.g;
  outColor = vec4(gbColor, gbColor, gbColor, originColor.a);
}
`;

const createShader = (context, type, source) => {
  const shader = context.createShader(type);
  context.shaderSource(shader, source);
  context.compileShader(shader);
  return shader;
};

const createProgram = ({
  context,
  vertexShaderSource,
  fragmentShaderSource,
}) => {
  if (!context || !vertexShaderSource || !fragmentShaderSource) {
    return;
  }
  const vertexShader = createShader(
    context,
    context.VERTEX_SHADER,
    vertexShaderSource
  );
  const fragmentShader = createShader(
    context,
    context.FRAGMENT_SHADER,
    fragmentShaderSource
  );
  const program = context.createProgram();
  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);
  const success = context.getProgramParameter(program, context.LINK_STATUS);
  if (success) {
    return { vertexShader, fragmentShader, program };
  }
  // eslint-disable-next-line no-console
  console.error('Link failed:', context.getProgramInfoLog(program));
  // eslint-disable-next-line no-console
  console.error('vs info-log:', context.getShaderInfoLog(vertexShader));
  // eslint-disable-next-line no-console
  console.error('fs info-log:', context.getShaderInfoLog(fragmentShader));
  context.deleteShader(vertexShader);
  context.deleteShader(fragmentShader);
  context.deleteProgram(program);
  return;
};

const clearGlCore = ({
  context,
  vertexShader,
  fragmentShader,
  program,
} = {}) => {
  if (!context) {
    return;
  }
  vertexShader && context.deleteShader(vertexShader);
  fragmentShader && context.deleteShader(fragmentShader);
  program && context.deleteProgram(program);
};

const GreenBlueChannelHook = ({ canvasRef, pixelSource }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [maxFps] = useState(30);
  const [fps, setFps] = useState(0);

  const webGlContext = useRef();
  const vertexShader = useRef();
  const fragmentShader = useRef();
  const program = useRef();
  const animationFrame = useRef();
  const lastFrameTimestamp = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return () =>
        clearGlCore({
          context: webGlContext.current,
          vertexShader: vertexShader.current,
          fragmentShader: fragmentShader.current,
          program: program.current,
        });
    }

    const rect = canvas.getBoundingClientRect();
    canvas.height = rect.height;
    canvas.width = rect.width;
    webGlContext.current = canvas.getContext('webgl2');

    const glCore = createProgram({
      context: webGlContext.current,
      vertexShaderSource,
      fragmentShaderSource,
    });
    if (glCore) {
      vertexShader.current = glCore.vertexShader;
      fragmentShader.current = glCore.fragmentShader;
      program.current = glCore.program;

      return () =>
        clearGlCore({
          context: webGlContext.current,
          vertexShader: vertexShader.current,
          fragmentShader: fragmentShader.current,
          program: program.current,
        });
    }
  }, [canvasRef]);

  useEffect(() => {
    const nextFrame = () => {
      const context = webGlContext.current;
      if (!context || !pixelSource || !program.current) {
        return;
      }

      console.log('nextFrame()');

      // clear
      context.clearColor(0, 0, 0, 1);
      context.clear(context.COLOR_BUFFER_BIT);

      // draw
      context.useProgram(program.current);
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
    <StyledGreenBlueChannelHook>
      <Header>GreenBlueChannelHook</Header>
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
      </Footer>
    </StyledGreenBlueChannelHook>
  );
};

GreenBlueChannelHook.propTypes = {
  pixelSource: PropTypes.shape({
    current: PropTypes.node,
  }),
  canvasRef: PropTypes.object.isRequired,
};

GreenBlueChannelHook.defaultProps = {
  pixelSource: null,
};

const StyledGreenBlueChannelHook = styled.div`
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

export default GreenBlueChannelHook;
