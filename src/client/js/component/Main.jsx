// Main.jsx
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

import MediaStreamHandler from '../component/MediaStreamHandler.jsx';
import MediaStreamMonitor from '../component/MediaStreamMonitor.jsx';
import BeautifyFilter from '../component/BeautifyFilter.jsx';
import FilterPanel from '../component/FilterPanel.jsx';
import ExposureValue from '../component/ExposureValue.jsx';
import GreenBlueChannel from '../component/GreenBlueChannel.jsx';
import GaussianBlur from '../component/GaussianBlur.jsx';
import HighPassFilter from '../component/HighPassFilter.jsx';
import HardLight from '../component/HardLight.jsx';
import ToneCurve from '../component/ToneCurve.jsx';
import MaskBlender from '../component/MaskBlender.jsx';

import BeautifyFilterCore from '../resource/BeautifyFilter.js';

const Main = () => {
  const [mediaStream, setMediaStream] = useState();
  const sourceVideo = useRef();
  const beautifyFilterCore = useRef(new BeautifyFilterCore());
  const exposureValueCanvas = useRef();
  const greenBlueChannelCanvas = useRef();
  const gaussianBlurCanvas = useRef();
  const highPassFilterCanvas = useRef();
  const hardLightCanvas = useRef();
  const toneCurveCanvas = useRef();
  const maskBlenderCanvas = useRef();

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
      <MediaStreamHandler onChange={({ value }) => setMediaStream(value)} />
      <Modules>
        <ModuleWrapper>
          <FilterPanel
            filterName="BeautifyFilterPanel"
            filterCore={beautifyFilterCore.current}
            pixelSource={sourceVideo.current}
          />
        </ModuleWrapper>
        <ModuleWrapper>
          <BeautifyFilter pixelSource={sourceVideo.current} />
        </ModuleWrapper>
        <ModuleWrapper>
          <ExposureValue
            pixelSource={sourceVideo.current}
            canvasRef={exposureValueCanvas}
          />
        </ModuleWrapper>
        <ModuleWrapper>
          <GreenBlueChannel
            pixelSource={exposureValueCanvas.current}
            canvasRef={greenBlueChannelCanvas}
          />
        </ModuleWrapper>
        <ModuleWrapper>
          <GaussianBlur
            pixelSource={greenBlueChannelCanvas.current}
            canvasRef={gaussianBlurCanvas}
          />
        </ModuleWrapper>
        <ModuleWrapper>
          <HighPassFilter
            pixelSource={greenBlueChannelCanvas.current}
            blurredPixelSource={gaussianBlurCanvas.current}
            canvasRef={highPassFilterCanvas}
          />
        </ModuleWrapper>
        <ModuleWrapper>
          <HardLight
            pixelSource={highPassFilterCanvas.current}
            canvasRef={hardLightCanvas}
          />
        </ModuleWrapper>
        <ModuleWrapper>
          <ToneCurve
            pixelSource={sourceVideo.current}
            canvasRef={toneCurveCanvas}
          />
        </ModuleWrapper>
        <ModuleWrapper>
          <MediaStreamMonitor mediaStream={mediaStream} />
        </ModuleWrapper>
        <ModuleWrapper>
          <MaskBlender
            pixelSource={sourceVideo.current}
            maskSource={hardLightCanvas.current}
            blendSource={toneCurveCanvas.current}
            canvasRef={maskBlenderCanvas}
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
