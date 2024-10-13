import { forwardRef } from "react";

interface duckParamType {
  jumpType: "normal" | "single" | "double";
  gameIsOver: boolean;
  animationState: "paused" | "running";
}

const Duck = forwardRef<HTMLDivElement, duckParamType>(
  ({ jumpType, animationState }: duckParamType, ref) => {
    return (
      <div
        id="duckImage"
        className="w-[12rem] h-[12rem] object-cover absolute left-[30%] top-[40%] transition-all z-[9999]"
        style={{
          backgroundSize: "cover",
          transform: `translateY(${
            jumpType == "double"
              ? "-110px"
              : jumpType == "single"
              ? "-60px"
              : "0px"
          })`,
          animationPlayState: animationState,
        }}
      >
        <div
          ref={ref}
          className="w-[66px] h-[82px] bg-blue-500 relative z-[9999] "
          style={{ right: "-62px", bottom: "-41px" }}
        ></div>
      </div>
    );
  }
);

/* <img
      src={state ? frame3 : frame1}
      alt="duck"
      className="w-[12rem] h-[12rem] object-cover  absolute left-[30%] top-[40%] transition-all"
      style={{
        transform: `translateY(${state ? "-60px" : "0px"})`,
      }}
    /> */

export default Duck;
