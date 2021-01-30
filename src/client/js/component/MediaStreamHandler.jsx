// MediaStreamHandler.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ResetButtonStyle from '../style/ResetButtonStyle.js';

export class MediaStreamHandler extends React.PureComponent {
  state = {
    isStarted: false,
    mediaStream: null,
    error: false,
  };
  video = React.createRef();

  startRecording = async () => {
    const { onChange, onError } = this.props;
    try {
      this.setState({ isStarted: true });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      this.setState({ mediaStream: stream });
      return onChange({ value: stream });
    } catch (error) {
      this.setState({ error, isStarted: false });
      return onError({ error, target: this });
    }
  };

  stopRecording = () => {
    const { mediaStream } = this.state;
    const { onChange } = this.props;
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach(track => track.stop());
      onChange({ value: null });
      this.setState({ mediaStream: null, isStarted: false });
    }
  };

  componentDidUpdate(_, prevState) {
    const { mediaStream } = this.state;
    if (mediaStream && mediaStream !== prevState.mediaStream) {
      this.video.current.srcObject = mediaStream;
      this.video.current.play();
    }
  }

  componentWillUnmount() {
    this.stopRecording();
  }

  renderDescription = () => {
    const { isStarted, mediaStream, error } = this.state;

    if (isStarted) {
      if (mediaStream) {
        return `Media stream id: ${mediaStream.id}`;
      } else {
        return 'Loading mediaStream ...';
      }
    }

    if (error) {
      return `Error: ${JSON.stringify(error.message)}`;
    }

    return 'Idle';
  };

  renderBody = () => {
    const { mediaStream } = this.state;
    return (
      <Body>
        <div>{this.renderDescription()}</div>
        {mediaStream && <video ref={this.video} playsInline />}
      </Body>
    );
  };

  render() {
    const { mediaStream } = this.state;
    return (
      <StyledMediaStreamHandler>
        <Header>MediaStreamHandler</Header>
        {this.renderBody()}
        <Footer>
          {mediaStream ? (
            <StopButton onClick={this.stopRecording}>Stop</StopButton>
          ) : (
            <StartButton onClick={this.startRecording}>Start</StartButton>
          )}
        </Footer>
      </StyledMediaStreamHandler>
    );
  }
}

MediaStreamHandler.propTypes = {
  onChange: PropTypes.func,
  onError: PropTypes.func,
};

MediaStreamHandler.defaultProps = {
  onChange: () => null,
  onError: () => null,
};

const StyledMediaStreamHandler = styled.div`
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
  & > video {
    margin-top: 8px;
    width: 100%;
  }
`;

const Footer = styled.div`
  background-color: #4834d4;
  padding: 8px;
`;

const Button = styled.button`
  ${ResetButtonStyle}
  border-radius: 4px;
  padding: 4px;
  color: white;
  font-size: 14px;
`;

const StartButton = styled(Button)`
  background-color: #6ab04c;
`;

const StopButton = styled(Button)`
  background-color: #eb4d4b;
`;

export default MediaStreamHandler;
