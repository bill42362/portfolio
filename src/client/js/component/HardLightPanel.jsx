// HardLightPanel.jsx
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ResetButtonStyle from '../style/ResetButtonStyle.js';

const sliceKey = 'hardLight';

const HardLightPanel = ({
  registerSlice,
  unregisterSlice,
  cycles,
  onChange,
}) => {
  const [isActived, setIsActived] = useState(false);
  const canvasRef = useRef();
  const sliceId = useRef(Math.random());

  useEffect(() => {
    const unregister = () =>
      unregisterSlice({ key: sliceKey, sliceId: sliceId.current });
    unregister();
    if (isActived) {
      registerSlice({
        key: sliceKey,
        sliceId: sliceId.current,
        canvas: canvasRef.current,
      });
    }
    return unregister;
  }, [isActived, registerSlice, unregisterSlice]);
  return (
    <StyledHardLight>
      <Header>
        <Title>HardLightPanel</Title>
        <EnableButton
          isActived={isActived}
          onClick={() => setIsActived(!isActived)}
        >
          Open
        </EnableButton>
      </Header>
      {isActived && (
        <Body>
          <canvas ref={canvasRef} />
        </Body>
      )}
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
  registerSlice: PropTypes.func,
  unregisterSlice: PropTypes.func,
  cycles: PropTypes.number,
  onChange: PropTypes.func,
};

HardLightPanel.defaultProps = {
  registerSlice: () => null,
  unregisterSlice: () => null,
  cycles: 3,
  onChange: () => null,
};

const StyledHardLight = styled.div`
  border: solid 1px #4834d4;
  border-radius: 8px;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  background-color: #4834d4;
  padding: 8px;
`;

const Title = styled.div`
  flex: 1;
  align-self: center;
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

const EnableButton = styled(Button).attrs(({ isActived }) => {
  return {
    style: {
      backgroundColor: isActived ? '#6ab04c' : '#badc58',
    },
  };
})``;

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
