// index.js
import styled from 'styled-components';
import PropTypes from 'prop-types';

import Main from '../component/Main.jsx';
import Footer from '../component/Footer.jsx';

import env from '../resource/env.js';

export default function Home({ props }) {
  // eslint-disable-next-line no-console
  console.log('Home() props:', props);

  return (
    <StyledHome>
      <Main />
      <Footer branchName={env.branchName} />
    </StyledHome>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 10,
  };
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
