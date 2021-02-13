// ToneCurve.jsx
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ToneCurveEditor from '../component/ToneCurveEditor.jsx';

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

uniform float uStrength;
uniform sampler2D uSource;
uniform sampler2D uTone;
in vec2 vTextCoord;

out vec4 outColor;

void main() {
  vec4 colorIndex = texture(uSource, vTextCoord);
  float revStr = 1.0 - uStrength;
  outColor = vec4(
    uStrength * vec4(texture(uTone, vec2(colorIndex.r, 0))).r + revStr * colorIndex.r,
    uStrength * vec4(texture(uTone, vec2(colorIndex.g, 0))).g + revStr * colorIndex.g,
    uStrength * vec4(texture(uTone, vec2(colorIndex.b, 0))).b + revStr * colorIndex.b,
    1.0
  );
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
const defaultToneTextureData = new ImageData(
  new Uint8ClampedArray(
    new Array(256).fill(0).flatMap((_, index) => [index, index, index, 255])
  ),
  256
);

const ToneCurve = ({ canvasRef, pixelSource }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [strength, setStrength] = useState(0.5);
  const [maxFps, setMaxFps] = useState(30);
  const [fps, setFps] = useState(0);

  const animationFrame = useRef();
  const lastFrameTimestamp = useRef(0);
  const toneTextureData = useRef(defaultToneTextureData);

  const webGlContext = useRef();
  const vertexShader = useRef();
  const fragmentShader = useRef();
  const program = useRef();

  const positionLocation = useRef();
  const textCoordLocation = useRef();
  const pixelLocation = useRef();
  const strengthLocation = useRef();
  const toneLocation = useRef();

  const shouldUpdateStrength = useRef(true);
  const shouldUpdateToneTexture = useRef(true);

  const positionBuffer = useRef();
  const textCoordBuffer = useRef();
  const pixelTexture = useRef();
  const toneTexture = useRef();

  useEffect(() => {
    shouldUpdateStrength.current = true;
  }, [strength]);

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
      if (toneTexture.current) {
        context.deleteTexture(toneTexture.current);
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
    pixelLocation.current = context.getUniformLocation(
      glCore.program,
      'uSource'
    );
    strengthLocation.current = context.getUniformLocation(
      glCore.program,
      'uStrength'
    );
    toneLocation.current = context.getUniformLocation(glCore.program, 'uTone');

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
    pixelTexture.current = createTexture({ context, index: 0 });
    toneTexture.current = createTexture({ context, index: 1 });

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

      const canvasWidth = context.canvas.width;
      const canvasHeight = context.canvas.height;
      if (canvasWidth !== sourceWidth || canvasHeight !== sourceHeight) {
        context.canvas.width = sourceWidth;
        context.canvas.height = sourceHeight;
        context.viewport(0, 0, sourceWidth, sourceHeight);
      }

      // clear
      context.clearColor(0, 0, 0, 1);
      context.clear(context.COLOR_BUFFER_BIT);

      // draw
      context.useProgram(program.current);

      if (shouldUpdateStrength.current) {
        context.uniform1f(strengthLocation.current, strength);
        shouldUpdateStrength.current = false;
      }

      context.uniform1i(pixelLocation.current, 0);
      context.bindTexture(context.TEXTURE_2D, pixelTexture.current);
      context.texImage2D(
        context.TEXTURE_2D,
        0, // mip level
        context.RGBA, // internam format
        context.RGBA, // src format
        context.UNSIGNED_BYTE, // src type
        pixelSource
      );

      if (shouldUpdateToneTexture.current) {
        shouldUpdateToneTexture.current = false;
      }
      // TODO: figure out why must apply tone texture every frame
      // TODO: figure out why must apply tone texture after pixelSource
      context.uniform1i(toneLocation.current, 1);
      context.bindTexture(context.TEXTURE_2D, toneTexture.current);
      context.texImage2D(
        context.TEXTURE_2D,
        0, // mip level
        context.RGBA, // internam format
        context.RGBA, // src format
        context.UNSIGNED_BYTE, // src type
        toneTextureData.current
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
  }, [shouldAnimate, maxFps, strength, pixelSource]);

  const handleToneChange = tonePoints => {
    const data = new ImageData(
      new Uint8ClampedArray(
        new Array(256)
          .fill(0)
          .flatMap((_, index) => [
            tonePoints.red[index].y,
            tonePoints.green[index].y,
            tonePoints.blue[index].y,
            255,
          ])
      ),
      256
    );
    toneTextureData.current = data;
    shouldUpdateToneTexture.current = true;
  };

  return (
    <StyledToneCurve>
      <Header>ToneCurve</Header>
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
          <Label>
            <span>Strength: {strength}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={strength}
              onChange={e => setStrength(e.target.value)}
            />
          </Label>
          <ToneCurveEditor onChange={handleToneChange} />
        </Controls>
      </Footer>
    </StyledToneCurve>
  );
};

ToneCurve.propTypes = {
  pixelSource: PropTypes.object,
  canvasRef: PropTypes.object.isRequired,
};

ToneCurve.defaultProps = {
  pixelSource: null,
};

const StyledToneCurve = styled.div`
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
  * + * {
    margin-top: 4px;
  }
`;

const Label = styled.label`
  display: flex;

  input {
    flex: 1;
    margin-left: 8px;
  }
`;

export default ToneCurve;
