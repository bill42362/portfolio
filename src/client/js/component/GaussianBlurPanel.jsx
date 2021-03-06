// GaussianBlurPanel.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const GaussianBlurPanel = ({ canvasRef, radius, sigma, onChange }) => {
  return (
    <StyledGaussianBlur>
      <Header>GaussianBlurPanel</Header>
      <Body>
        <canvas ref={canvasRef} />
      </Body>
      <Footer>
        <Controls>
          <Label>
            <span>Radius: {radius}</span>
            <input
              type="range"
              min="1"
              max="32"
              step="1"
              value={radius}
              onChange={e => onChange({ radius: +e.target.value, sigma })}
            />
          </Label>
          <Label>
            <span>Sigma: {sigma}</span>
            <input
              type="range"
              min="0.1"
              max="20"
              step="0.1"
              value={sigma}
              onChange={e => onChange({ sigma: +e.target.value, radius })}
            />
          </Label>
        </Controls>
      </Footer>
    </StyledGaussianBlur>
  );
};

GaussianBlurPanel.propTypes = {
  canvasRef: PropTypes.object.isRequired,
  radius: PropTypes.number,
  sigma: PropTypes.number,
  onChange: PropTypes.func,
};

GaussianBlurPanel.defaultProps = {
  radius: 16,
  sigma: 16,
  onChange: () => null,
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

const Footer = styled.div`
  background-color: #4834d4;
  padding: 8px;
  button + span {
    margin-left: 8px;
  }
`;

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

export default GaussianBlurPanel;
