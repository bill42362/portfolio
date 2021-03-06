// HardLightPanel.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const HardLightPanel = ({ canvasRef, cycles, onChange }) => {
  return (
    <StyledHardLight>
      <Header>HardLightPanel</Header>
      <Body>
        <canvas ref={canvasRef} />
      </Body>
      <Footer>
        <Controls>
          <Label>
            <span>Cycles: {cycles}</span>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={cycles}
              onChange={e => onChange({ cycles: +e.target.value })}
            />
          </Label>
        </Controls>
      </Footer>
    </StyledHardLight>
  );
};

HardLightPanel.propTypes = {
  canvasRef: PropTypes.object.isRequired,
  cycles: PropTypes.number,
  onChange: PropTypes.func,
};

HardLightPanel.defaultProps = {
  cycles: 3,
  onChange: () => null,
};

const StyledHardLight = styled.div`
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

export default HardLightPanel;
