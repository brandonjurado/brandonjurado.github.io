import React from 'react';
import ToggleTheme from '../ToggleTheme';
import { Wrapper } from './styles';
import { Link } from "gatsby"

const NavbarLinks = ({ desktop }) => {

  return (
    <Wrapper desktop={desktop} theme={`dark`}>
      <Link to="#about">About</Link>
      <Link to="#experience">Experience</Link>
      <Link to="#education">Education</Link>
      <Link to="#skills">Skills</Link>
      <Link to="#interests">Interests</Link>
      <Link to="#projects">Projects</Link>
      <Link to="#contact">Contact</Link>
      <ToggleTheme />
    </Wrapper>
  )

};

export default NavbarLinks;
