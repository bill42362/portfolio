// Main.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import MediaStreamHandler from '../component/MediaStreamHandler.jsx';
import MediaStreamMonitor from '../component/MediaStreamMonitor.jsx';
import ToneCurve from '../component/ToneCurve.jsx';

const Main = () => {
  const [mediaStream, setMediaStream] = useState();
  const sourceVideo = useRef();
  const toneCurveCanvas = useRef();

  useEffect(() => {
    const video = document.createElement('video');
    // required to tell iOS safari we don't want fullscreen
    video.setAttribute('playsinline', true);
    sourceVideo.current = video;
    return () => {
      video.srcObject = null;
      return video.pause();
    };
  }, []);

  useEffect(() => {
    sourceVideo.current.srcObject = mediaStream;
    if (mediaStream) {
      sourceVideo.current.play();
    } else {
      sourceVideo.current.pause();
    }
  }, [mediaStream]);

  return (
    <StyledMain>
      <ModuleWrapper>
        <MediaStreamHandler onChange={({ value }) => setMediaStream(value)} />
      </ModuleWrapper>
      <ModuleWrapper>
        <MediaStreamMonitor mediaStream={mediaStream} />
      </ModuleWrapper>
      <ModuleWrapper>
        <ToneCurve
          pixelSource={sourceVideo.current}
          canvasRef={toneCurveCanvas}
        />
      </ModuleWrapper>
    </StyledMain>
  );
};

const StyledMain = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
`;

const ModuleWrapper = styled.div`
  & + & {
    margin-top: 8px;
  }
`;

export default Main;
