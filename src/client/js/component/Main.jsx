// Main.jsx
import React, { useState } from 'react';
import styled from 'styled-components';

import MediaStreamHandler from '../component/MediaStreamHandler.jsx';
import MediaStreamMonitor from '../component/MediaStreamMonitor.jsx';

const Main = () => {
  const [mediaStream, setMediaStream] = useState(null);
  return (
    <StyledMain>
      <ModuleWrapper>
        <MediaStreamHandler onChange={({ value }) => setMediaStream(value)} />
      </ModuleWrapper>
      <ModuleWrapper>
        <MediaStreamMonitor mediaStream={mediaStream} />
      </ModuleWrapper>
    </StyledMain>
  );
};

const StyledMain = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 8px;
`;

const ModuleWrapper = styled.div`
  & + & {
    margin-top: 8px;
  }
`;

export default Main;
