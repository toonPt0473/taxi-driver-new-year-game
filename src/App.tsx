import { useState } from "react";
import { initialLocalWord, setNewWordSet, WORD_SET_KEY } from "./generateWord";
import { GameZone } from "./GameZone";
import { WordSetType } from "./type";

import "swiper/css";

function App() {
  const [wordSet, setWordSet] = useState<Record<string, WordSetType>>(
    initialLocalWord()
  );
  const [currentSet, setCurrentSet] = useState<string | null>(null);

  const handleClickSet = (key: string) => {
    setCurrentSet(key);
  };

  const generateNewGroupSet = (numberOfSet: number) => {
    const newSet = setNewWordSet(numberOfSet);
    setWordSet(newSet);
  };

  const handleGameEnd = (point: number) => {
    if (currentSet) {
      const newCurrentSet = {
        ...wordSet[currentSet],
        point,
      };
      const newSet = {
        ...wordSet,
        [currentSet]: newCurrentSet,
      };
      setWordSet(newSet);
      localStorage.setItem(WORD_SET_KEY, JSON.stringify(newSet));
      setCurrentSet(null);
    }
  };
  console.log(wordSet);
  if (currentSet === null) {
    return (
      <div style={{ position: "relative", paddingTop: 40 }}>
        <div style={{ position: "absolute", top: 0, right: 0 }}>
          <button onClick={() => generateNewGroupSet(8)}>
            generate new set
          </button>
        </div>
        <h2 style={{ textAlign: "center" }}>Select your Driver</h2>
        <div
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "40px",
            width: "100vw",
            height: "100vh",
            flexWrap: "wrap",
          }}
        >
          {Object.values(wordSet).map((value) => {
            return (
              <button
                style={{ width: "40%", textAlign: "center" }}
                onClick={() => handleClickSet(value.name)}
                disabled={!!value.point}
              >
                <img
                  src={value.image}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    height: "150px",
                  }}
                />
                <p
                  style={{
                    width: "100%",
                    textAlign: "center",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {value.name} {value.point ? `  (${value.point} point)` : ""}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        width: "100vw",
        height: "100vh",
        flexWrap: "wrap",
        overflow: "auto",
      }}
    >
      <GameZone
        wordSet={wordSet[currentSet].value}
        onGameEnd={handleGameEnd}
        onBack={() => setCurrentSet(null)}
      />
    </div>
  );
}

export default App;
