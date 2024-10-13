import frame1 from "../assets/frame1.png";
// import frame2 from "../assets/frame2.png";
import frame3 from "../assets/frame3.png";
interface duckParamType {
  state: boolean;
}

const Duck = ({ state }: duckParamType) => {
  return (
    <img
      src={state ? frame3 : frame1}
      alt="duck"
      className="w-[12rem] h-[12rem] object-cover  absolute left-[30%] top-[40%] transition-all"
      style={{
        transform: `translateY(${state ? "-60px" : "0px"})`,
      }}
    />
  );
};

export default Duck;
