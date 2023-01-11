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

const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

let interval: number | undefined;
const GAME_TIME = 90;

const countSound = new Audio(
  "http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatpellet.ogg"
);
const endSound = new Audio(
  "https://assets.mixkit.co/sfx/preview/mixkit-arcade-retro-game-over-213.mp3"
);
const correctSound = new Audio("/correct.mp3");
const skipSound = new Audio("/skip.mp3");

export const GameZone: FC<GameZoneProps> = ({
  wordSet,
  onGameEnd,
  onBack,
  sound,
}) => {
  const musicSound = new Audio(sound);
  const [gameState, setGameState] = useState<GameStateType>(GameStateType.INIT);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [bg, setBg] = useState(`#${randomColor()}`);
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
          setBg("transparent");
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
      correctSound.pause();
      correctSound.currentTime = 0;
      correctSound.play();
    } else {
      skipSound.pause();
      skipSound.currentTime = 0;
      skipSound.play();
    }
    setCurrentWordIndex((w) => w + 1);
    setBg(`#${randomColor()}`);
  };
  useEffect(() => {
    musicSound.play();
    return () => {
      musicSound.pause();
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: bg,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          top: 0,
          width: "90%",
          margin: "auto",
          zIndex: 100,
        }}
      >
        <button
          onClick={onBack}
          style={{ fontSize: 48, padding: "10px 20px", lineHeight: "60px" }}
        >
          Back
        </button>
        <p
          style={{
            background: "black",
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 48,
            lineHeight: "60px",
          }}
        >
          Time left: {gameTime}
        </p>
      </div>
      <div>
        {gameState === GameStateType.INIT && (
          <button
            onClick={handleStart}
            style={{ fontSize: 48, padding: "10px 20px", lineHeight: "60px" }}
          >
            Start Game
          </button>
        )}
        {gameState === GameStateType.RUNNING && wordSet[currentWordIndex] && (
          <div
            style={{
              background: "white",
              padding: "20px 30px",
              color: "black",
            }}
          >
            <p style={{ fontSize: 80, margin: 0, lineHeight: "100px" }}>
              {wordSet[currentWordIndex]}
            </p>
            <SwipeZone handleTouched={handleSwipe} />
          </div>
        )}
        {gameState === GameStateType.RUNNING && !wordSet[currentWordIndex] && (
          <div
            style={{
              background: "white",
              padding: "10px 20px",
              color: "black",
            }}
          >
            <p style={{ fontSize: 80, margin: 0, lineHeight: "100px" }}>
              คำใบ้หมดแล้วจ้าา
            </p>
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
              <p style={{ fontSize: 48, lineHeight: "60px" }}>
                Your Point: {point}
              </p>
              <button
                onClick={() => onGameEnd(point)}
                style={{
                  fontSize: 48,
                  padding: "10px 20px",
                  lineHeight: "60px",
                }}
              >
                DONE
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

GameZone.displayName = "GameZone";

export default GameZone;
