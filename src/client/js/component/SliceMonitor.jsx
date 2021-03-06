// SliceMonitor.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SliceMonitor = ({ sliceName, canvasRef }) => {
  return (
    <StyledSliceMonitor>
      <Header>{sliceName}</Header>
      <Body>
        <canvas ref={canvasRef} />
      </Body>
      <Footer></Footer>
    </StyledSliceMonitor>
  );
};

SliceMonitor.propTypes = {
  sliceName: PropTypes.string,
  canvasRef: PropTypes.object.isRequired,
};

SliceMonitor.defaultProps = {
  sliceName: '',
};

const StyledSliceMonitor = styled.div`
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
  button + span {
    margin-left: 8px;
  }
`;

export default SliceMonitor;
