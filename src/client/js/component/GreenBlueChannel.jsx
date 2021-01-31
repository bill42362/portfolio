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

const vertexAttribute = {
  array: [-1, -1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1],
  numComponents: 2,
};
const textCoordAttribute = {
  array: [0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
  numComponents: 2,
};

const glStateTemplate = {
  sources: {
    attributes: {
      vertex: null,
      textCoord: null,
    },
    shaders: {
      vertex: null,
      fragment: null,
    },
  },
  program: null,
  shaders: { vertex: null, fragment: null },
  locations: {
    attributes: { aPosition: null, aTextCoord: null },
    textures: { uSource: null },
  },
  buffers: { aPosition: null, aTextCoord: null },
  textures: { uSource: null },
};

const getGlState = ({
  vertexShaderSource = null,
  fragmentShaderSource = null,
  vertexAttribute = null,
  textCoordAttribute = null,
} = {}) => {
  return {
    ...glStateTemplate,
    sources: {
      attributes: {
        vertex: vertexAttribute,
        textCoord: textCoordAttribute,
      },
      shaders: { vertex: vertexShaderSource, fragment: fragmentShaderSource },
    },
  };
};

const createShader = (context, type, source) => {
  const shader = context.createShader(type);
  context.shaderSource(shader, source);
  context.compileShader(shader);
  return shader;
};

const createBuffer = (context, attribute) => {
  const buffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, buffer);
  context.bufferData(
    context.ARRAY_BUFFER,
    new Float32Array(attribute.array),
    context.STATIC_DRAW
  );
  return {
    buffer,
    numComponents: attribute.numComponents,
    count: Math.floor(attribute.array.length / attribute.numComponents),
    type: context.FLOAT,
    normalize: false,
    offset: 0,
    // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    stride: 0,
  };
};

const dockBuffer = (context, location, buffer) => {
  context.bindBuffer(context.ARRAY_BUFFER, buffer.buffer);
  context.vertexAttribPointer(
    location,
    buffer.numComponents,
    buffer.type,
    buffer.normalize,
    buffer.stride,
    buffer.offset
  );
};

const updateGlState = ({ context, oldState, newState }) => {
  const newAttributes = newState.sources.attributes;
  const oldAttributes = oldState.sources.attributes;
  if (newAttributes.vertex !== oldAttributes.vertex) {
    if (oldState.buffers.aPosition) {
      context.deleteBuffer(oldState.buffers.aPosition);
    }
    newState.buffers.aPosition = createBuffer(context, newAttributes.vertex);
  } else {
    newState.buffers.aPosition = oldState.buffers.aPosition;
  }
  if (newAttributes.textCoord !== oldAttributes.textCoord) {
    if (oldState.buffers.aTextCoord) {
      context.deleteBuffer(oldState.buffers.aTextCoord);
    }
    newState.buffers.aTextCoord = createBuffer(
      context,
      newAttributes.textCoord
    );
  } else {
    newState.buffers.aTextCoord = oldState.buffers.aTextCoord;
  }

  if (!oldState.textures.uSource) {
    const ctx = context;
    const texture = ctx.createTexture();
    ctx.activeTexture(ctx.TEXTURE0 + 0);
    ctx.bindTexture(ctx.TEXTURE_2D, texture);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
    newState.textures.uSource = texture;
  } else {
    newState.textures.uSource = oldState.textures.uSource;
  }

  const shouldUpdateVertexShader =
    oldState.sources.shaders.vertex !== newState.sources.shaders.vertex;
  if (shouldUpdateVertexShader) {
    newState.shaders.vertex = createShader(
      context,
      context.VERTEX_SHADER,
      newState.sources.shaders.vertex
    );
  } else {
    newState.shaders.vertex = oldState.shaders.vertex;
  }

  const shouldUpdateFragmentShader =
    oldState.sources.shaders.fragment !== newState.sources.shaders.fragment;
  if (shouldUpdateFragmentShader) {
    newState.shaders.fragment = createShader(
      context,
      context.FRAGMENT_SHADER,
      newState.sources.shaders.fragment
    );
  } else {
    newState.shaders.fragment = oldState.shaders.fragment;
  }

  if (shouldUpdateVertexShader || shouldUpdateFragmentShader) {
    const program = context.createProgram();
    context.attachShader(program, newState.shaders.vertex);
    context.attachShader(program, newState.shaders.fragment);
    context.linkProgram(program);
    const success = context.getProgramParameter(program, context.LINK_STATUS);
    if (success) {
      newState.program = program;
      if (oldState.shaders.vertex) {
        context.deleteShader(oldState.shaders.vertex);
      }
      if (oldState.shaders.fragment) {
        context.deleteShader(oldState.shaders.fragment);
      }
      if (oldState.program) {
        context.deleteProgram(oldState.program);
      }
    } else {
      // eslint-disable-next-line no-console
      console.error('Link failed:', context.getProgramInfoLog(program));
      // eslint-disable-next-line no-console
      console.error(
        'vertex shader info-log:',
        context.getShaderInfoLog(newState.shaders.vertex)
      );
      // eslint-disable-next-line no-console
      console.error(
        'fragment shader info-log:',
        context.getShaderInfoLog(newState.shaders.fragment)
      );
      context.deleteShader(newState.shaders.vertex);
      context.deleteShader(newState.shaders.fragment);
      context.deleteProgram(program);
      newState.program = oldState.program;
    }
  } else {
    newState.program = oldState.program;
  }

  if (newState.program !== oldState.program) {
    const oldLocations = oldState.locations;
    const newLocations = newState.locations;
    if (oldLocations.attributes.aPosition) {
      context.disableVertexAttribArray(oldLocations.attributes.aPosition);
    }
    if (oldLocations.attributes.aTextCoord) {
      context.disableVertexAttribArray(oldLocations.attributes.aTextCoord);
    }

    newLocations.attributes.aPosition = context.getAttribLocation(
      newState.program,
      'aPosition'
    );
    newLocations.attributes.aTextCoord = context.getAttribLocation(
      newState.program,
      'aTextCoord'
    );
    newLocations.textures.uSource = context.getUniformLocation(
      newState.program,
      'uSource'
    );

    context.enableVertexAttribArray(newLocations.attributes.aPosition);
    context.enableVertexAttribArray(newLocations.attributes.aTextCoord);
  } else {
    newState.locations = oldState.locations;
  }

  if (
    newState.program !== oldState.program ||
    newAttributes.vertex !== oldAttributes.vertex
  ) {
    dockBuffer(
      context,
      newState.locations.attributes.aPosition,
      newState.buffers.aPosition
    );
  }

  if (
    newState.program !== oldState.program ||
    newAttributes.textCoord !== oldAttributes.textCoord
  ) {
    dockBuffer(
      context,
      newState.locations.attributes.aTextCoord,
      newState.buffers.aTextCoord
    );
  }

  return newState;
};

export class GreenBlueChannel extends React.PureComponent {
  webGlContext = null;
  glState = getGlState();

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
  };

  nextFrame = () => {
    const { pixelSource } = this.props;
    const context = this.webGlContext;
    if (!context || !pixelSource) {
      return;
    }

    this.glState = updateGlState({
      context,
      oldState: this.glState,
      newState: getGlState({
        vertexShaderSource,
        fragmentShaderSource,
        vertexAttribute,
        textCoordAttribute,
      }),
    });

    // clear
    context.clearColor(0, 0, 0, 1);
    context.clear(context.COLOR_BUFFER_BIT);

    // draw
    context.useProgram(this.glState.program);

    context.bindTexture(context.TEXTURE_2D, this.glState.textures.uSource);
    context.texImage2D(
      context.TEXTURE_2D,
      0, // mip level
      context.RGBA, // internam format
      context.RGBA, // src format
      context.UNSIGNED_BYTE, // src type
      pixelSource
    );

    const aPositionBuffer = this.glState.buffers.aPosition;
    context.bindBuffer(context.ARRAY_BUFFER, aPositionBuffer.buffer);
    context.drawArrays(context.TRIANGLES, 0, aPositionBuffer.count);
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
