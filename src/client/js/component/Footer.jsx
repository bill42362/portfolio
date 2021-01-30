// Footer.jsx
import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import EmailIcon from '../../img/email-icon.svg';
import GithubIcon from '../../img/github-icon.svg';

export class Footer extends React.PureComponent {
  render() {
    const { email, github } = this.props;
    return (
      <StyledFooter>
        <Link href={github} target="_blank">
          <img src={GithubIcon} alt="github" />
        </Link>
        <Link href={`mailto:${email}`} target="_blank">
          <img src={EmailIcon} alt="email" />
        </Link>
      </StyledFooter>
    );
  }
}

Footer.propTypes = {
  email: PropTypes.string,
  github: PropTypes.string,
};

Footer.defaultProps = {
  email: 'bill42362@gmail.com',
  github: 'https://github.com/bill42362/portfolio',
};

const StyledFooter = styled.div`
  flex: auto;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 20px;
`;

const Link = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  background-color: #576574;

  & + & {
    margin-left: 8px;
  }
  img {
    width: 60%;
    height: auto;
  }
`;

export default Footer;
