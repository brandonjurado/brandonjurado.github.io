import {useEffect, useState} from "react";
import Icon from "../../components/icon/Icon";
import "./Top.scss";

export default function Top() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 20);
    update();
    window.addEventListener("scroll", update, {passive: true});
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <button
      type="button"
      id="topButton"
      aria-label="Go to top"
      hidden={!visible}
      onClick={() => window.scrollTo({top: 0, behavior: "instant"})}
    >
      <Icon name="handPointUp" />
    </button>
  );
}
