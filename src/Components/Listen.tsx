import { useEffect, useRef } from "react";
import useGameController from "../utils/useGameController";
import { useGameStore } from "../store/useGameStore";

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

// Throttle function to limit how often a function can be called
const throttle = (func: Function, limit: number) => {
  let lastRan: number | null = null;

  return function (...args: any[]) {
    const context = this;
    if (!lastRan || Date.now() - lastRan >= limit) {
      func.apply(context, args);
      lastRan = Date.now();
    }
  };
};

const Listen: React.FC = () => {
  const { handleStartedGame } = useGameController();
  const { gameIsOver } = useGameStore();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const lastJumpTimeRef = useRef<number>(0); // To track the last jump time

  useEffect(() => {
    const handleMicrophoneAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
        const audioContext = audioContextRef.current;
        if (!audioContext) return;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

        // Throttled noise detection function
        const detectNoise = throttle(() => {
          if (!dataArrayRef.current || !analyserRef.current) return;

          analyser.getByteFrequencyData(dataArrayRef.current);
          const averageVolume =
            dataArrayRef.current.reduce((sum, value) => sum + value, 0) /
            dataArrayRef.current.length;

          const currentTime = Date.now();

          // Cooldown threshold of 500ms (adjust as needed)
          if (
            averageVolume > 70 && // Adjust this threshold based on your testing
            !gameIsOver &&
            currentTime - lastJumpTimeRef.current > 500
          ) {
            console.log("Noise detected! Jump triggered.");
            handleStartedGame();
            lastJumpTimeRef.current = currentTime;
          }
        }, 200); // Check for noise every 500ms

        const intervalId = setInterval(detectNoise, 16); // Call detectNoise at approximately 60 FPS
        return () => clearInterval(intervalId); // Clean up the interval on component unmount
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    handleMicrophoneAccess();

    return () => {
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== "closed"
      ) {
        audioContextRef.current.close().catch((error) => {
          console.error("Error closing AudioContext:", error);
        });
      }
    };
  }, [gameIsOver, handleStartedGame]);

  return (
    <div>
      <p>Make a loud noise to trigger the jump!</p>
    </div>
  );
};

export default Listen;
