import React from 'react';
import NavbarLinks from '../NavbarLinks';
import { Wrapper } from './styles';

const Sidebar = ({ sidebar, toggle, theme = `dark` }) => {
  return (
  <Wrapper active={sidebar} onClick={toggle} theme={theme}>
    <NavbarLinks />
  </Wrapper>
  )
};

export default Sidebar;
