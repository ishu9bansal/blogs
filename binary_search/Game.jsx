import { useState, useEffect } from "react";

export default function GuessMyNumber() {
  const MAX_STEPS = 10;

  const [low, setLow] = useState(1);
  const [high, setHigh] = useState(1000);
  const [mid, setMid] = useState(500);
  const [step, setStep] = useState(0);
  const [history, setHistory] = useState([]);
  const [phase, setPhase] = useState("intro"); // 'intro', 'playing', 'done'
  const [finalGuess, setFinalGuess] = useState(null);
  const [prevStates, setPrevStates] = useState([]);

  useEffect(() => {
    if (phase === "playing") {
      const newMid = Math.floor((low + high) / 2);
      setMid(newMid);
    }
  }, [low, high, step, phase]);

  const startGame = () => {
    setPhase("playing");
    setLow(1);
    setHigh(1000);
    setStep(0);
    setHistory([]);
    setFinalGuess(null);
    setPrevStates([]);
  };

  const handleAnswer = (isYes) => {
    setPrevStates([...prevStates, { low, high, step, history }]);
    const newHistory = [...history, {
      step: step + 1,
      rangeLow: low,
      rangeHigh: mid,
      answer: isYes ? "✅" : "❌"
    }];
    setHistory(newHistory);

    if (low === high || step + 1 >= MAX_STEPS) {
      const guess = isYes ? mid : mid + 1;
      setFinalGuess(guess);
      setPhase("done");
      return;
    }

    if (isYes) {
      setHigh(mid);
    } else {
      setLow(mid + 1);
    }
    setStep(step + 1);
  };

  const resetGame = () => {
    setPhase("intro");
    setLow(1);
    setHigh(1000);
    setStep(0);
    setHistory([]);
    setFinalGuess(null);
    setPrevStates([]);
  };

  const undoLast = () => {
    const prev = prevStates.pop();
    if (prev) {
      setLow(prev.low);
      setHigh(prev.high);
      setStep(prev.step);
      setHistory(prev.history);
      setPrevStates([...prevStates]);
    }
  };

  const renderBar = () => {
    const total = 1000;
    const widthPercent = ((high - low + 1) / total) * 100;
    const leftPercent = ((low - 1) / total) * 100;
    return (
      <div className="w-full bg-gray-300 h-3 my-4 relative rounded overflow-hidden">
        <div
          className="bg-blue-500 h-full"
          style={{ width: `${widthPercent}%`, left: `${leftPercent}%`, position: "absolute" }}
        ></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans p-4">
      <div className="max-w-xl mx-auto bg-white shadow-lg p-6 rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Guess My Number</h1>

        {phase === "intro" && (
          <div className="text-center">
            <p className="text-lg">Think of a number between 1 and 1000 and keep it secret.</p>
            <p className="mt-2">I will guess it in 10 questions or less using binary search.</p>
            <button
              onClick={startGame}
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500"
            >
              Begin
            </button>
          </div>
        )}

        {phase === "playing" && (
          <div className="text-center">
            <p className="text-lg font-medium mb-4">
              Q{step + 1}: Is your number between <span className="text-blue-600 font-bold">{low}</span> and <span className="text-blue-600 font-bold">{mid}</span>?
            </p>
            {renderBar()}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
              <button
                onClick={() => handleAnswer(true)}
                className="bg-green-300 px-6 py-2 rounded hover:bg-green-200"
              >
                ✅ Yes (My number is in range: {low} - {mid})
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="bg-red-300 px-6 py-2 rounded hover:bg-red-200"
              >
                ❌ No (My number is in range: {mid + 1} - {high})
              </button>
            </div>
            <button
              onClick={undoLast}
              className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-400"
            >
              Undo Last
            </button>
          </div>
        )}

        {phase === "done" && (
          <div className="text-center">
            <p className="text-xl font-bold text-green-700 mb-2">🎯 Your number is <span className="underline">{finalGuess}</span>!</p>
            <p className="mb-4 text-gray-700">Identified in {step + 1} steps using binary search logic.</p>
            {renderBar()}
            <button
              onClick={resetGame}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500"
            >
              Restart
            </button>
          </div>
        )}

        {history.length > 0 && (
          <div className="mt-6 bg-black text-green-400 p-4 rounded font-mono">
            <h2 className="text-xl mb-2">[ Search History ]</h2>
            <ul className="list-none space-y-1">
              {history.map((entry, index) => (
                <li key={index}>
                  <span className="inline-block w-10">Q{entry.step}:</span>
                  <span className="inline-block w-28"> {String(entry.rangeLow).padStart(3, '0')} - {String(entry.rangeHigh).padStart(3, '0')}</span>
                  <span className="ml-2">→ <span>{entry.answer}</span></span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
