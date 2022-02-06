// Main.jsx
import React from 'react';
import styled from 'styled-components';

export class Main extends React.PureComponent {
  render() {
    return <StyledMain></StyledMain>;
  }
}

const StyledMain = styled.div`
  flex: auto;
`;

export default Main;
