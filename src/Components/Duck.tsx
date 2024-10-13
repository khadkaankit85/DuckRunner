interface duckParamType {
  jumpType: "normal" | "single" | "double";
  gameIsOver: boolean;
  animationState: "paused" | "running";
}

const Duck = ({ jumpType, animationState }: duckParamType) => {
  return (
    <div
      id="duckImage"
      className="w-[12rem] h-[12rem] object-cover absolute left-[30%] top-[40%] transition-all"
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
    />
  );
};

/* <img
      src={state ? frame3 : frame1}
      alt="duck"
      className="w-[12rem] h-[12rem] object-cover  absolute left-[30%] top-[40%] transition-all"
      style={{
        transform: `translateY(${state ? "-60px" : "0px"})`,
      }}
    /> */

export default Duck;
