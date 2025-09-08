import React, {useContext} from "react";
import "./Footer.scss";
import {motion as m} from "framer-motion";
import StyleContext from "../../contexts/StyleContext";

export default function Footer() {
  const {isDark} = useContext(StyleContext);
  return (
    <m.div
      initial={{opacity: 0, y: 20}}
      whileInView={{opacity: 1, y: 0}}
      transition={{duration: 1}}
      viewport={{once: true, amount: 0.2}}
    >
      <div className="footer-div">
        <p className={isDark ? "dark-mode footer-text" : "footer-text"}>
          Copyright &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </m.div>
  );
}
