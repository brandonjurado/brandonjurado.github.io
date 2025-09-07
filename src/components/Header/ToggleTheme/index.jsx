import React from 'react';
import sunIcon from '../../../assets/icons/sun.svg';
import moonIcon from '../../../assets/icons/moon.svg';
import { Wrapper } from './styles';
import { useColorMode } from "theme-ui"


const ToggleTheme = () => {
  const [colorMode, setColorMode] = useColorMode()
  const isDark = colorMode === `dark`
  const toggleColorMode = () => {
    setColorMode(isDark ? `light` : `dark`)
  }

  return (
    <Wrapper type="button" onClick={toggleColorMode}>
      <img src={colorMode === 'light' ? moonIcon : sunIcon} alt={colorMode} />
    </Wrapper>
  );
};

export default ToggleTheme;