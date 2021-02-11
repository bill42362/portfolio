// GaussianBlur.jsx
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
uniform vec2 uResolution;
uniform int uKernelSize;
uniform float uKernelData[33];
in vec2 vTextCoord;

out vec4 outColor;

void main() {
  vec2 delta = 1.0 / uResolution;
  vec4 outputColor = vec4(0.0, 0.0, 0.0, 0.0);

  for (int x = -uKernelSize; x <= uKernelSize; x++) {
    vec2 offset = vTextCoord + vec2(x, 0.0) * delta;
    outputColor += uKernelData[x] * texture(uSource, offset);
  }

  outColor = outputColor;
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

const getKernal = (inputRadius, sigma) => {
  const radius = Math.floor(Math.abs(inputRadius));
  const size = radius * 2 + 1;
  const sigma2 = sigma * sigma;
  const data = new Array(size);
  let sum = 0;
  for (let x = -radius; x <= radius; ++x) {
    const index = x + radius;
    data[index] =
      Math.exp(-(x * x) / (2.0 * sigma2)) / Math.sqrt(2.0 * Math.PI * sigma2);
    sum += data[index];
  }
  const normalizedData = data.map(value => value / sum);
  return { data: new Float32Array(normalizedData), size };
};

const GaussianBlur = ({ canvasRef, pixelSource }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [maxFps] = useState(30);
  const [radius] = useState(8);
  const [sigma] = useState(5);
  const [fps, setFps] = useState(0);

  const animationFrame = useRef();
  const lastFrameTimestamp = useRef(0);
  const shouldUpdateKernalUniform = useRef(false);
  const kernal = useRef();

  const webGlContext = useRef();
  const vertexShader = useRef();
  const fragmentShader = useRef();
  const program = useRef();

  const positionLocation = useRef();
  const textCoordLocation = useRef();
  const resolutionLocation = useRef();
  const pixelLocation = useRef();

  const kernalDataLocation = useRef();
  const kernalSizeLocation = useRef();

  const positionBuffer = useRef();
  const textCoordBuffer = useRef();
  const pixelTexture = useRef();

  useEffect(() => {
    kernal.current = getKernal(radius, sigma);
    shouldUpdateKernalUniform.current = true;
  }, [radius, sigma]);

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
    resolutionLocation.current = context.getUniformLocation(
      glCore.program,
      'uResolution'
    );
    kernalDataLocation.current = context.getUniformLocation(
      glCore.program,
      'uKernelData'
    );
    kernalSizeLocation.current = context.getUniformLocation(
      glCore.program,
      'uKernelSize'
    );
    pixelLocation.current = context.getAttribLocation(
      glCore.program,
      'uSource'
    );

    context.enableVertexAttribArray(positionLocation.current);
    context.enableVertexAttribArray(textCoordLocation.current);

    context.useProgram(program.current);
    context.uniform2f(
      resolutionLocation.current,
      context.canvas.width,
      context.canvas.height
    );
    context.uniform1fv(kernalDataLocation.current, kernal.current.data);
    context.uniform1i(kernalSizeLocation.current, kernal.current.size);

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

      let sourceWidth = context.canvas.width;
      let sourceHeight = context.canvas.height;
      if ('VIDEO' == pixelSource.nodeName) {
        sourceWidth = pixelSource.videoWidth;
        sourceHeight = pixelSource.videoHeight;
      } else if ('CANVAS' === pixelSource.nodeName) {
        sourceWidth = pixelSource.width;
        sourceHeight = pixelSource.height;
      }

      // clear
      context.clearColor(0, 0, 0, 1);
      context.clear(context.COLOR_BUFFER_BIT);

      // draw
      context.useProgram(program.current);

      const canvasWidth = context.canvas.width;
      const canvasHeight = context.canvas.height;
      if (canvasWidth !== sourceWidth || canvasHeight !== sourceHeight) {
        context.canvas.width = sourceWidth;
        context.canvas.height = sourceHeight;
        context.viewport(0, 0, sourceWidth, sourceHeight);
        context.uniform2f(
          resolutionLocation.current,
          sourceWidth,
          sourceHeight
        );
      }

      if (shouldUpdateKernalUniform.current) {
        context.uniform1fv(kernalDataLocation.current, kernal.current.data);
        context.uniform1i(kernalSizeLocation.current, kernal.current.size);
        shouldUpdateKernalUniform.current = false;
      }

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
    <StyledGaussianBlur>
      <Header>GaussianBlur</Header>
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
    </StyledGaussianBlur>
  );
};

GaussianBlur.propTypes = {
  pixelSource: PropTypes.object,
  canvasRef: PropTypes.object.isRequired,
};

GaussianBlur.defaultProps = {
  pixelSource: null,
};

const StyledGaussianBlur = styled.div`
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

export default GaussianBlur;
