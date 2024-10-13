// import frame2 from "../assets/frame2.png";
import frame3 from "../assets/frame3.png";
interface duckParamType {
  state: boolean;
  gameIsOver: boolean;
  animationState: "paused" | "running";
}

const Duck = ({ state, animationState }: duckParamType) => {
  const frame3Bgimage = {
    backgroundImage: `url(${frame3})`,
    animation: "none",
  };
  const padding1 = { padding: "0px" };
  return (
    <div
      id="duckImage"
      className="w-[12rem] h-[12rem] object-cover absolute left-[30%] top-[40%] transition-all"
      style={{
        backgroundSize: "cover",
        transform: `translateY(${state ? "-60px" : "0px"})`,
        ...(state ? frame3Bgimage : padding1),
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
