// Main.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import MediaStreamHandler from '../component/MediaStreamHandler.jsx';
import FilterPanel from '../component/FilterPanel.jsx';
import SliceMonitor from '../component/SliceMonitor.jsx';
import GaussianBlurPanel from '../component/GaussianBlurPanel.jsx';

import BeautifyFilter from '../resource/BeautifyFilter.js';

const Main = () => {
  const [mediaStream, setMediaStream] = useState();
  const [gaussianBlur, setGaussianBlur] = useState({ radius: 16, sigma: 5 });
  const sourceVideo = useRef();
  const beautifyFilter = useRef();
  const sourceCanvasRef = useRef();
  const greenBlueCanvasRef = useRef();
  const gaussianBlurCanvasRef = useRef();
  const hardLightCanvasRef = useRef();
  const toneCurveCanvasRef = useRef();

  useEffect(() => {
    const video = document.createElement('video');
    // required to tell iOS safari we don't want fullscreen
    video.setAttribute('playsinline', true);
    sourceVideo.current = video;

    beautifyFilter.current = new BeautifyFilter();
    window.beautifyFilter = beautifyFilter.current;
    beautifyFilter.current.registerSlice({
      key: 'source',
      canvas: sourceCanvasRef.current,
    });
    beautifyFilter.current.registerSlice({
      key: 'greenBlueChannel',
      canvas: greenBlueCanvasRef.current,
    });
    beautifyFilter.current.registerSlice({
      key: 'gaussianBlur',
      canvas: gaussianBlurCanvasRef.current,
    });
    beautifyFilter.current.registerSlice({
      key: 'hardLight',
      canvas: hardLightCanvasRef.current,
    });
    beautifyFilter.current.registerSlice({
      key: 'toneCurve',
      canvas: toneCurveCanvasRef.current,
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

  useEffect(() => {
    beautifyFilter.current.updateGaussianBlurKernal(gaussianBlur);
  }, [gaussianBlur]);

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
          <SliceMonitor sliceName="Source" canvasRef={sourceCanvasRef} />
        </ModuleWrapper>
        <ModuleWrapper>
          <SliceMonitor
            sliceName="GreenBlueChannel"
            canvasRef={greenBlueCanvasRef}
          />
        </ModuleWrapper>
        <ModuleWrapper>
          <GaussianBlurPanel
            canvasRef={gaussianBlurCanvasRef}
            radius={gaussianBlur.radius}
            sigma={gaussianBlur.sigma}
            onChange={setGaussianBlur}
          />
        </ModuleWrapper>
        <ModuleWrapper>
          <SliceMonitor sliceName="HardLight" canvasRef={hardLightCanvasRef} />
        </ModuleWrapper>
        <ModuleWrapper>
          <SliceMonitor sliceName="ToneCurve" canvasRef={toneCurveCanvasRef} />
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
