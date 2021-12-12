// Footer.jsx
import React from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import styled from 'styled-components';

import EmailIcon from '../public/img/email-icon.svg';
import GithubIcon from '../public/img/github-icon.svg';

const githubBaseUrl = 'https://github.com/bill42362/portfolio';

export class Footer extends React.PureComponent {
  render() {
    const { email, branchName } = this.props;
    const githubUrl = branchName
      ? `${githubBaseUrl}/tree/${branchName}`
      : githubBaseUrl;
    return (
      <StyledFooter>
        <Link href={githubUrl} target="_blank">
          <Image alt="github" src={GithubIcon} width={150} height={150} />
        </Link>
        <Link href={`mailto:${email}`} target="_blank">
          <Image alt="email" src={EmailIcon} width={150} height={150} />
        </Link>
      </StyledFooter>
    );
  }
}

Footer.propTypes = {
  email: PropTypes.string,
  branchName: PropTypes.string,
};

Footer.defaultProps = {
  email: 'bill42362@gmail.com',
  branchName: '',
};

const StyledFooter = styled.div`
  flex: none;
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
  background-color: ${({ theme }) => theme.colors.darkGray};
  padding: 6px;

  & + & {
    margin-left: 8px;
  }
`;

export default Footer;
