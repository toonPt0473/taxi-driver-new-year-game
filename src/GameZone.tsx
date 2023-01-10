import { FC, useEffect, useState } from "react";
import { Fireworks } from "@fireworks-js/react";
import { SwipeZone } from "./SwipeZone";
import { Direction } from "./type";
import "./App.css";

interface GameZoneProps {
  wordSet: Array<string>;
  sound: string;
  onGameEnd: (point: number) => void;
  onBack: () => void;
}

enum GameStateType {
  INIT = "init",
  RUNNING = "running",
  OVER = "over",
}

let interval: number | undefined;
const GAME_TIME = 60;

const countSound = new Audio(
  "http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatpellet.ogg"
);
const endSound = new Audio(
  "https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-game-over-213.mp3"
);

export const GameZone: FC<GameZoneProps> = ({
  wordSet,
  onGameEnd,
  onBack,
  sound,
}) => {
  const musicSound = new Audio(sound);
  const [gameState, setGameState] = useState<GameStateType>(GameStateType.INIT);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [point, setPoint] = useState(0);
  const [gameTime, setGameTime] = useState(GAME_TIME);
  const handleStart = () => {
    musicSound.pause();
    setPoint(0);
    setGameState(GameStateType.RUNNING);
    interval = setInterval(() => {
      setGameTime((time) => {
        if (time <= 6 && time > 1) {
          countSound.play();
        }
        if (time === 1) {
          endSound.play();
        }
        if (time === 0) {
          setGameState(GameStateType.OVER);
          clearInterval(interval);
          return time;
        }
        return time - 1;
      });
    }, 1000);
  };
  const handleSwipe = (direction: Direction) => {
    if (direction === Direction.RIGHT || direction === Direction.LEFT) {
      setPoint((p) => p + 1);
    }
    setCurrentWordIndex((w) => w + 1);
  };
  useEffect(() => {
    musicSound.play();
    return () => {
      musicSound.pause();
    };
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          top: 0,
          width: "90%",
          margin: "auto",
        }}
      >
        <button onClick={onBack}>Back</button>
        <p>Time left: {gameTime}</p>
      </div>
      <div>
        {gameState === GameStateType.INIT && (
          <button onClick={handleStart}>Start Game</button>
        )}
        {gameState === GameStateType.RUNNING && (
          <div style={{ maxHeight: "70vh" }}>
            <p>{wordSet[currentWordIndex]}</p>
            <SwipeZone handleTouched={handleSwipe} />
          </div>
        )}

        {gameState === GameStateType.OVER && (
          <>
            <Fireworks
              options={{
                rocketsPoint: {
                  min: 0,
                  max: 5,
                },
              }}
              style={{
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                position: "absolute",
                background: "#000",
                display: "flex",
                backgroundColor: "transparent",
                zIndex: -1,
              }}
            />
            <div style={{ textAlign: "center" }}>
              <p>Your Point: {point}</p>
              <button onClick={() => onGameEnd(point)}>DONE</button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

GameZone.displayName = "GameZone";

export default GameZone;
