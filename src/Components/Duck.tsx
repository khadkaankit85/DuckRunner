import React, { forwardRef } from "react";
import { useGameStore } from "../store/useGameStore";

type DuckProps = React.HTMLProps<HTMLDivElement>;

const Duck = forwardRef<HTMLDivElement, DuckProps>((_props, ref) => {
  const { jumpType, animationState } = useGameStore();

  return (
    <div
      id="duckImage"
      className="w-[12rem] h-[12rem] object-cover absolute  min-[940px]:left-[30%] top-[40%] transition-all z-[9999]"
      style={{
        backgroundSize: "cover",
        transform: `translateY(${
          jumpType === "double"
            ? "-110px"
            : jumpType === "single"
            ? "-60px"
            : "0px"
        })`,
        animationPlayState: animationState,
      }}
    >
      <div
        ref={ref}
        className="w-[66px] h-[82px] bg-blue-5 relative z-[9999]"
        style={{ right: "-62px", bottom: "-41px" }}
      ></div>
    </div>
  );
});

export default Duck;
