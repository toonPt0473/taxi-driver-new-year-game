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

const IMAGE_POINT = {
  bad: ["/bad1.gif", "/bad2.gif"],
  good: ["/good1.gif", "/good2.gif", "/good3.gif"],
  wow: ["/wow1.gif", "/wow2.gif", "/wow3.gif"],
};

const random = (array: Array<string>) => {
  return array[Math.floor(Math.random() * array.length)];
};

const randomColor = () => Math.floor(Math.random() * 16777215).toString(16);

let interval: number | undefined;
const GAME_TIME = 180;

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
  const getPointImage = () => {
    if (point <= 5) {
      return random(IMAGE_POINT.bad);
    }
    if (point <= 8) {
      return random(IMAGE_POINT.good);
    }
    return random(IMAGE_POINT.wow);
  };
  const handleStart = () => {
    musicSound.pause();
    musicSound.currentTime = 0;
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
          musicSound.play();
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
    if (direction === Direction.LEFT) {
      setPoint((p) => p + 1);
      correctSound.pause();
      correctSound.currentTime = 0;
      correctSound.play();
      setCurrentWordIndex((w) => w + 1);
      setBg(`#${randomColor()}`);
    }
    if (direction === Direction.RIGHT) {
      skipSound.pause();
      skipSound.currentTime = 0;
      skipSound.play();
      setCurrentWordIndex((w) => w + 1);
      setBg(`#${randomColor()}`);
    }
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
          style={{
            fontSize: 32,
            padding: "10px 20px",
            lineHeight: "40px",
          }}
        >
          Back
        </button>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            fontSize: 32,
            margin: 0,
            marginBottom: 0,
            lineHeight: "40px",
          }}
        >
          Time left: {gameTime}
        </button>
      </div>
      <div style={{ width: "100%", textAlign: "center" }}>
        {gameState === GameStateType.INIT && (
          <button
            onClick={handleStart}
            style={{
              fontSize: 48,
              padding: "10px 20px",
              lineHeight: "60px",
            }}
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
            <p
              style={{
                fontSize: 56,
                margin: 0,
                lineHeight: "70px",
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: 24 }}>Current Point: {point}</span>
              <br />
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
            <p style={{ fontSize: 56, margin: 0, lineHeight: "70px" }}>
              <span style={{ fontSize: 24 }}>Current Point: {point}</span>
              <br />
              คำใบ้หมดแล้วจ้าา
            </p>
          </div>
        )}

        {gameState === GameStateType.OVER && (
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
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

            <div
              style={{
                textAlign: "center",
                backgroundImage: `url("${getPointImage()}")`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                flex: 1,
                height: 200,
              }}
            ></div>
            <div
              style={{
                textAlign: "center",
                flex: 1,
              }}
            >
              <p style={{ fontSize: 48, lineHeight: "60px" }}>
                Your Point: {point}
              </p>
              <button
                onClick={() => onGameEnd(point)}
                style={{
                  fontSize: 32,
                  padding: "10px 20px",
                  lineHeight: "40px",
                }}
              >
                DONE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

GameZone.displayName = "GameZone";

export default GameZone;
