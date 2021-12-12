// index.js
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Main from '../component/Main.jsx';
import Footer from '../component/Footer.jsx';

const isServer = typeof window === 'undefined';
const branchName = isServer
  ? process.env.BRANCH_NAME
  : window.__SSR_ENVIRONMENT__?.branchName;

export default function Home({ props }) {
  // eslint-disable-next-line no-console
  console.log('Home() props:', props);
  return (
    <StyledHome>
      <Main />
      <Footer branchName={branchName} />
    </StyledHome>
  );
}

Home.propTypes = {
  props: PropTypes.object,
};

Home.defaultProps = {
  props: null,
};

const StyledHome = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.black};
`;
