// MediaStreamMonitor.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ResetButtonStyle from '../style/ResetButtonStyle.js';

export class MediaStreamMonitor extends React.PureComponent {
  state = {
    shouldPreview: false,
  };
  video = React.createRef();

  componentDidUpdate(_, prevState) {
    const { mediaStream } = this.props;
    const { shouldPreview } = this.state;
    if (!mediaStream && mediaStream !== prevState.mediaStream) {
      this.setState({ shouldPreview: false });
    }
    if (
      mediaStream &&
      shouldPreview &&
      shouldPreview !== prevState.shouldPreview
    ) {
      this.video.current.srcObject = mediaStream;
      this.video.current.play();
    }
  }

  handleTogglePreview = () => {
    const { mediaStream } = this.props;
    const { shouldPreview } = this.state;
    if (!mediaStream) {
      return;
    }
    return this.setState({ shouldPreview: !shouldPreview });
  };

  render() {
    const { mediaStream } = this.props;
    const { shouldPreview } = this.state;
    return (
      <StyledMediaStreamMonitor>
        <Header>MediaStreamMonitor</Header>
        <Body>{shouldPreview && <video ref={this.video} playsInline />}</Body>
        <Footer>
          <ToggleButton
            isActived={shouldPreview}
            disabled={!mediaStream}
            onClick={this.handleTogglePreview}
          >
            Open
          </ToggleButton>
        </Footer>
      </StyledMediaStreamMonitor>
    );
  }
}

MediaStreamMonitor.propTypes = {
  mediaStream: PropTypes.object,
};

MediaStreamMonitor.defaultProps = {
  mediaStream: null,
};

const StyledMediaStreamMonitor = styled.div`
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
  & + & {
    margin-left: 8px;
  }
`;

const ToggleButton = styled(Button).attrs(({ isActived }) => {
  return {
    style: {
      backgroundColor: isActived ? '#6ab04c' : '#badc58',
    },
  };
})``;

export default MediaStreamMonitor;
