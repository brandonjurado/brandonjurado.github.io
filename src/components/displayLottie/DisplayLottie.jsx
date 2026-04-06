import React from "react";
import Lottie from "lottie-react";

export default function DisplayLottie({
  animationData,
  loop = true,
  autoplay = true,
  ...props
}) {
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      aria-hidden="true"
      {...props}
    />
  );
}
