// Main.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import MediaStreamHandler from '../component/MediaStreamHandler.jsx';
import FilterPanel from '../component/FilterPanel.jsx';
import SliceMonitor from '../component/SliceMonitor.jsx';

import BeautifyFilter from '../resource/BeautifyFilter.js';

const Main = () => {
  const [mediaStream, setMediaStream] = useState();
  const sourceVideo = useRef();
  const beautifyFilter = useRef(new BeautifyFilter());
  const greenBlueCanvasRef = useRef();

  useEffect(() => {
    const video = document.createElement('video');
    // required to tell iOS safari we don't want fullscreen
    video.setAttribute('playsinline', true);
    sourceVideo.current = video;

    beautifyFilter.current.registerSlice({
      key: 'greenBlueChannel',
      canvas: greenBlueCanvasRef.current,
    });
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
      <MediaStreamHandler onChange={({ value }) => setMediaStream(value)} />
      <Modules>
        <ModuleWrapper>
          <FilterPanel
            filterName="BeautifyFilterPanel"
            filterCore={beautifyFilter.current}
            pixelSource={sourceVideo.current}
          />
        </ModuleWrapper>
        <ModuleWrapper>
          <SliceMonitor
            sliceName="GreenBlueChannel"
            canvasRef={greenBlueCanvasRef}
          />
        </ModuleWrapper>
      </Modules>
    </StyledMain>
  );
};

const StyledMain = styled.div`
  padding: 8px;
`;

const Modules = styled.div`
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  margin-top: 8px;
`;

const ModuleWrapper = styled.div``;

export default Main;
