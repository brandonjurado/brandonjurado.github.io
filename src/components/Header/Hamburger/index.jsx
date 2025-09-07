import React from 'react';
import { Wrapper, Bar } from './styles';

const Hamburger = ({ sidebar, toggle }) => {
  
  return (
    <Wrapper sidebar={sidebar} onClick={() => toggle(!sidebar)}>
      <Bar top sidebar={sidebar} theme={`dark`}/>
      <Bar mid sidebar={sidebar} theme={`dark`} />
      <Bar bottom sidebar={sidebar} theme={`dark`} />
    </Wrapper>
  )
};

export default Hamburger;
