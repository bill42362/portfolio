// MediaStreamHandler.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export class MediaStreamHandler extends React.PureComponent {
  state = {
    mediaStream: null,
    error: false,
  };

  async componentDidMount() {
    const { onChange, onError } = this.props;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      this.setState({ mediaStream: stream });
      return onChange({ value: stream });
    } catch (error) {
      this.setState({ error });
      return onError({ error, target: this });
    }
  }

  componentWillUnmount() {
    const { mediaStream } = this.state;
    const { onChange } = this.props;
    if (mediaStream) {
      const tracks = mediaStream.getTracks();
      tracks.forEach(track => track.stop());
      onChange({ value: null });
    }
  }

  renderContent = () => {
    const { mediaStream, error } = this.state;

    if (mediaStream) {
      return `Media stream id: ${mediaStream.id}`;
    }

    if (error) {
      return `Error: ${JSON.stringify(error.message)}`;
    }

    return 'Loading mediaStream ...';
  };

  render() {
    return (
      <StyledMediaStreamHandler>
        <Header>MediaStreamHandler</Header>
        <Body>{this.renderContent()}</Body>
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
  background-color: #686de0;
  padding: 8px;
`;

export default MediaStreamHandler;
