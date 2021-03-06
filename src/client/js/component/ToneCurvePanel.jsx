// ToneCurvePanel.jsx
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ToneCurveEditor, {
  defaultToneCurveControlPoints,
} from '../component/ToneCurveEditor.jsx';

const ToneCurvePanel = ({
  canvasRef,
  strength,
  controlPoints,
  tension,
  onChange,
}) => {
  const handleCurvePointsChange = useCallback(
    ({ controlPoints, tension }) =>
      onChange({ controlPoints, tension, strength }),
    [strength, onChange]
  );
  return (
    <StyledToneCurve>
      <Header>ToneCurvePanel</Header>
      <Body>
        <canvas ref={canvasRef} />
      </Body>
      <Footer>
        <Controls>
          <Label>
            <span>Strength: {strength}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={strength}
              onChange={e =>
                onChange({ strength: +e.target.value, controlPoints, tension })
              }
            />
          </Label>
          <EditorWrapper>
            <ToneCurveEditor
              controlPoints={controlPoints}
              tension={tension}
              onChange={handleCurvePointsChange}
            />
          </EditorWrapper>
        </Controls>
      </Footer>
    </StyledToneCurve>
  );
};

ToneCurvePanel.propTypes = {
  canvasRef: PropTypes.object.isRequired,
  strength: PropTypes.number,
  controlPoints: PropTypes.shape({
    red: PropTypes.array.isRequired,
    green: PropTypes.array.isRequired,
    blue: PropTypes.array.isRequired,
  }),
  tension: PropTypes.number,
  onChange: PropTypes.func,
};

ToneCurvePanel.defaultProps = {
  strength: 0.5,
  controlPoints: defaultToneCurveControlPoints,
  tension: 0.0,
  onChange: () => null,
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

const EditorWrapper = styled.div`
  margin-top: 8px;
`;

export default ToneCurvePanel;
