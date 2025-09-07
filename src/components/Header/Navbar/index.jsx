import React from 'react';
import { Link } from 'gatsby';
import { Container } from '../../common';
import NavbarLinks from '../NavbarLinks';
import { Wrapper, Brand } from './styles';

const Navbar = () => {

  return (
    <Wrapper as={Container}>
      <Brand as={Link} to="/" theme={`dark`}>
        Brandon Jurado
      </Brand>
      <NavbarLinks desktop />
    </Wrapper>
  );
};

export default Navbar;
