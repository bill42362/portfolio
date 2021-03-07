// SliceMonitor.jsx
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ResetButtonStyle from '../style/ResetButtonStyle.js';

const SliceMonitor = ({
  sliceKey,
  sliceName,
  registerSlice,
  unregisterSlice,
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
  }, [sliceKey, isActived, registerSlice, unregisterSlice]);

  return (
    <StyledSliceMonitor>
      <Header>
        <Title>{sliceName}</Title>
        <EnableButton
          isActived={isActived}
          onClick={() => setIsActived(!isActived)}
        >
          Open
        </EnableButton>
      </Header>
      {isActived && (
        <>
          <Body>
            <canvas ref={canvasRef} />
          </Body>
          <Footer></Footer>
        </>
      )}
    </StyledSliceMonitor>
  );
};

SliceMonitor.propTypes = {
  sliceKey: PropTypes.string,
  sliceName: PropTypes.string,
  registerSlice: PropTypes.func,
  unregisterSlice: PropTypes.func,
};

SliceMonitor.defaultProps = {
  sliceKey: 'greenBlueChannel',
  sliceName: '',
  registerSlice: () => null,
  unregisterSlice: () => null,
};

const StyledSliceMonitor = styled.div`
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

export default SliceMonitor;
