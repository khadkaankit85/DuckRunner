import { useEffect, useState } from "react";
import Duck from "../Components/Duck";

const DuckDuckGo = () => {
  //   const [gameIsOver, setgameIsOver] = useState(true);
  const [isJumping, setisJumping] = useState(false);

  //logic to handle jump is here
  useEffect(() => {
    let jumpTimeoutID: number;
    function handleJump(e: KeyboardEvent) {
      console.log("clieck handing");
      if (e.key == " ") {
        setisJumping(true);
        if (jumpTimeoutID) {
          clearTimeout(jumpTimeoutID);
        }
        jumpTimeoutID = setTimeout(() => {
          setisJumping(false);
        }, 200);
      }
    }

    document.addEventListener("keydown", handleJump);
    return () => document.removeEventListener("keydown", handleJump);
  }, []);

  return (
    <div className=" w-full h-screen ">
      <Duck state={isJumping} />
    </div>
  );
};

export default DuckDuckGo;
