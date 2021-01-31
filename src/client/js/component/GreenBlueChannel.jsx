// GreenBlueChannel.jsx
import React from 'react';
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

const vertexArray = [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1];
const vertexArrayBuffer = new Float32Array(vertexArray);
const texCoordArray = [0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0];
const texCoordArrayBuffer = new Float32Array(texCoordArray);

const createShader = (context, type, source) => {
  const shader = context.createShader(type);
  context.shaderSource(shader, source);
  context.compileShader(shader);
  const success = context.getShaderParameter(shader, context.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  // eslint-disable-next-line no-console
  console.log(context.getShaderInfoLog(shader));
  context.deleteShader(shader);
  return null;
};

const createProgram = (context, vertexShader, fragmentShader) => {
  const program = context.createProgram();
  context.attachShader(program, vertexShader);
  context.attachShader(program, fragmentShader);
  context.linkProgram(program);
  const success = context.getProgramParameter(program, context.LINK_STATUS);
  if (success) {
    return program;
  }

  // eslint-disable-next-line no-console
  console.log(context.getProgramInfoLog(program));
  context.deleteProgram(program);
  return null;
};

export class GreenBlueChannel extends React.PureComponent {
  webGlContext = null;
  vertexShader = null;
  fragmentShader = null;
  program = null;

  aPositionLocation = null;
  aTexCoordLocation = null;
  uSourceLocation = null;

  aPositionBuffer = null;
  aTexCoordBuffer = null;
  uSourceTexture = null;

  initGl = () => {
    const { canvasRef } = this.props;
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const rect = canvas.getBoundingClientRect();
    canvas.height = rect.height;
    canvas.width = rect.width;

    let context = null;
    context = canvas.getContext('webgl2');
    this.webGlContext = context;

    this.vertexShader = createShader(
      context,
      context.VERTEX_SHADER,
      vertexShaderSource
    );
    this.fragmentShader = createShader(
      context,
      context.FRAGMENT_SHADER,
      fragmentShaderSource
    );
    this.program = createProgram(
      context,
      this.vertexShader,
      this.fragmentShader
    );

    this.aPositionLocation = context.getAttribLocation(
      this.program,
      'aPosition'
    );
    this.aPositionBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, this.aPositionBuffer);
    context.bufferData(
      context.ARRAY_BUFFER,
      vertexArrayBuffer,
      context.STATIC_DRAW
    );
    context.enableVertexAttribArray(this.aPositionLocation);
    context.vertexAttribPointer(
      this.aPositionLocation,
      2, // numComponents
      context.FLOAT, // type
      false, // normalize
      // how many bytes to get from one set of values to the next
      // 0 = use type and numComponents above
      0, // stride
      0 // offset
    );

    this.aTexCoordLocation = context.getAttribLocation(
      this.program,
      'aTextCoord'
    );
    this.aTexCoordBuffer = context.createBuffer();
    context.bindBuffer(context.ARRAY_BUFFER, this.aTexCoordBuffer);
    context.bufferData(
      context.ARRAY_BUFFER,
      texCoordArrayBuffer,
      context.STATIC_DRAW
    );
    context.enableVertexAttribArray(this.aTexCoordLocation);
    context.vertexAttribPointer(
      this.aTexCoordLocation,
      2,
      context.FLOAT,
      false,
      0,
      0
    );

    const ctx = context;
    this.uSourceLocation = ctx.getUniformLocation(this.program, 'uSource');
    this.uSourceTexture = ctx.createTexture();
    ctx.activeTexture(ctx.TEXTURE0 + 0);
    ctx.bindTexture(ctx.TEXTURE_2D, this.uSourceTexture);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
    ctx.uniform1i(this.uSourceLocation, 0);
  };

  nextFrame = () => {
    const { pixelSource } = this.props;
    const context = this.webGlContext;
    if (!context || !pixelSource) {
      return;
    }

    // clear
    context.clearColor(0, 0, 0, 1);
    context.clear(context.COLOR_BUFFER_BIT);

    // draw
    context.useProgram(this.program);

    context.bindTexture(context.TEXTURE_2D, this.uSourceTexture);
    context.texImage2D(
      context.TEXTURE_2D,
      0, // mip level
      context.RGBA, // internam format
      context.RGBA, // src format
      context.UNSIGNED_BYTE, // src type
      pixelSource
    );

    context.bindBuffer(context.ARRAY_BUFFER, this.aPositionBuffer);
    context.drawArrays(context.TRIANGLES, 0, vertexArrayBuffer.length / 2);
  };

  componentDidMount() {
    this.initGl();
  }

  render() {
    const { canvasRef, pixelSource } = this.props;
    return (
      <StyledGreenBlueChannel>
        <Header>GreenBlueChannel</Header>
        <Body>
          <canvas ref={canvasRef} />
        </Body>
        <Footer>
          <DrawButton disabled={!pixelSource} onClick={this.nextFrame}>
            Draw
          </DrawButton>
        </Footer>
      </StyledGreenBlueChannel>
    );
  }
}

GreenBlueChannel.propTypes = {
  pixelSource: PropTypes.any,
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
`;

const DrawButton = styled(Button).attrs(({ isActived }) => {
  return {
    style: {
      backgroundColor: isActived ? '#6ab04c' : '#badc58',
    },
  };
})``;

export default GreenBlueChannel;
