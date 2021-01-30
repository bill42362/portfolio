// GreenBlueChannel.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const vertexShaderSource = `#version 300 es
in vec4 aPosition;

void main() {
  gl_Position = aPosition;
}
`;

const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 outColor;

void main() {
  outColor = vec4(1, 0, 0.5, 1);
}
`;

const vertexArray = [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1];
const vertexArrayBuffer = new Float32Array(vertexArray);

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
  video = null;
  webGlContext = null;
  vertexShader = null;
  fragmentShader = null;
  program = null;
  aPositionLocation = null;
  aPositionBuffer = null;

  initVideo = () => {
    const { mediaStream } = this.props;
    if (!this.video) {
      this.video = document.createElement('video');
      // required to tell iOS safari we don't want fullscreen
      this.video.setAttribute('playsinline', true);
    }
    if (mediaStream) {
      this.video.srcObject = mediaStream;
      this.video.play();
    }
  };

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
  };

  nextFrame = () => {
    const context = this.webGlContext;
    if (!context) {
      return;
    }

    // clear
    context.clearColor(0, 0, 0, 1);
    context.clear(context.COLOR_BUFFER_BIT);

    // draw
    context.useProgram(this.program);

    context.bindBuffer(context.ARRAY_BUFFER, this.aPositionBuffer);
    context.bufferData(
      context.ARRAY_BUFFER,
      vertexArrayBuffer,
      context.STATIC_DRAW
    );
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
    context.enableVertexAttribArray(this.aPositionLocation);
    context.drawArrays(context.TRIANGLES, 0, vertexArrayBuffer.length / 2);
  };

  clearVideo = () => {
    if (this.video) {
      this.video.pause();
      this.video.srcObject = null;
    }
  };

  componentDidMount() {
    this.initVideo();
    this.initGl();
    this.nextFrame();
  }

  componentDidUpdate(prevProps) {
    const { mediaStream } = this.props;
    if (!mediaStream && mediaStream !== prevProps.mediaStream) {
      this.clearVideo();
    }
  }

  componentWillUnmount() {
    this.clearVideo();
  }

  render() {
    const { canvasRef } = this.props;
    return (
      <StyledGreenBlueChannel>
        <Header>GreenBlueChannel</Header>
        <Body>
          <canvas ref={canvasRef} />
        </Body>
        <Footer></Footer>
      </StyledGreenBlueChannel>
    );
  }
}

GreenBlueChannel.propTypes = {
  mediaStream: PropTypes.object,
  canvasRef: PropTypes.object.isRequired,
};

GreenBlueChannel.defaultProps = {
  mediaStream: null,
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

const Footer = styled.div`
  background-color: #4834d4;
  padding: 8px;
`;

export default GreenBlueChannel;
