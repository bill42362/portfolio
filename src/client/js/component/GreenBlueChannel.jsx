// GreenBlueChannel.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import {
  createProgram,
  clearGlCore,
  createBuffer,
  createTexture,
  dockBuffer,
} from '../resource/WebGL.js';
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

const positionAttribute = {
  array: [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1],
  numComponents: 2,
};
const textCoordAttribute = {
  array: [0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
  numComponents: 2,
};

const GreenBlueChannel = ({ canvasRef, pixelSource }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [maxFps] = useState(30);
  const [fps, setFps] = useState(0);

  const animationFrame = useRef();
  const lastFrameTimestamp = useRef(0);

  const webGlContext = useRef();
  const vertexShader = useRef();
  const fragmentShader = useRef();
  const program = useRef();

  const positionLocation = useRef();
  const textCoordLocation = useRef();
  const pixelLocation = useRef();

  const positionBuffer = useRef();
  const textCoordBuffer = useRef();
  const pixelTexture = useRef();

  useEffect(() => {
    const clear = () => {
      const context = webGlContext.current;
      if (!context) {
        return;
      }

      if (positionBuffer.current.buffer) {
        context.deleteBuffer(positionBuffer.current.buffer);
      }
      if (textCoordBuffer.current.buffer) {
        context.deleteBuffer(textCoordBuffer.current.buffer);
      }
      if (pixelTexture.current) {
        context.deleteTexture(pixelTexture.current);
      }

      if (positionLocation.current) {
        context.disableVertexAttribArray(positionLocation.current);
      }
      if (textCoordLocation.current) {
        context.disableVertexAttribArray(textCoordLocation.current);
      }

      return clearGlCore({
        context,
        vertexShader: vertexShader.current,
        fragmentShader: fragmentShader.current,
        program: program.current,
      });
    };

    const canvas = canvasRef.current;
    if (!canvas) {
      return clear;
    }
    const rect = canvas.getBoundingClientRect();
    canvas.height = rect.height;
    canvas.width = rect.width;
    const context = canvas.getContext('webgl2');
    webGlContext.current = context;

    const glCore = createProgram({
      context,
      vertexShaderSource,
      fragmentShaderSource,
    });
    if (!glCore) {
      return clear;
    }
    vertexShader.current = glCore.vertexShader;
    fragmentShader.current = glCore.fragmentShader;
    program.current = glCore.program;

    positionLocation.current = context.getAttribLocation(
      glCore.program,
      'aPosition'
    );
    textCoordLocation.current = context.getAttribLocation(
      glCore.program,
      'aTextCoord'
    );
    pixelLocation.current = context.getAttribLocation(
      glCore.program,
      'uSource'
    );

    context.enableVertexAttribArray(positionLocation.current);
    context.enableVertexAttribArray(textCoordLocation.current);

    positionBuffer.current = createBuffer({
      context,
      attribute: positionAttribute,
    });
    textCoordBuffer.current = createBuffer({
      context,
      attribute: textCoordAttribute,
    });
    pixelTexture.current = createTexture({ context });

    dockBuffer({
      context,
      location: positionLocation.current,
      buffer: positionBuffer.current,
    });
    dockBuffer({
      context,
      location: textCoordLocation.current,
      buffer: textCoordBuffer.current,
    });

    return clear;
  }, [canvasRef]);

  useEffect(() => {
    const nextFrame = () => {
      const context = webGlContext.current;
      if (!context || !pixelSource || !program.current) {
        return;
      }

      // clear
      context.clearColor(0, 0, 0, 1);
      context.clear(context.COLOR_BUFFER_BIT);

      // draw
      context.useProgram(program.current);
      context.texImage2D(
        context.TEXTURE_2D,
        0, // mip level
        context.RGBA, // internam format
        context.RGBA, // src format
        context.UNSIGNED_BYTE, // src type
        pixelSource
      );
      context.drawArrays(context.TRIANGLES, 0, positionBuffer.current.count);
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
    <StyledGreenBlueChannel>
      <Header>GreenBlueChannel</Header>
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
    </StyledGreenBlueChannel>
  );
};

GreenBlueChannel.propTypes = {
  pixelSource: PropTypes.object,
  canvasRef: PropTypes.object.isRequired,
};

GreenBlueChannel.defaultProps = {
  pixelSource: null,
};

const StyledGreenBlueChannel = styled.div`
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

export default GreenBlueChannel;
