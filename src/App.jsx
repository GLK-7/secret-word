// React
import { useState, useCallback, useEffect } from 'react';

// Styles
import './App.css';

// Data
import { wordsList } from './data/words';
import { DIFFICULTIES } from './data/difficulties';

// Components
import StartScreen from './components/StartScreen/StartScreen';
import Game from './components/Game/Game';
import GameOver from './components/GameOver/GameOver';

const stages = [
  { id: 1, name: 'start' },
  { id: 2, name: 'game' },
  { id: 3, name: 'end' },
];

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES.medium);

  const [pickedWord, setPickedWord] = useState('');
  const [pickedCategory, setPickedCategory] = useState('');
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(difficulty.lives);
  const [score, setScore] = useState(0);
  const [wordsGuessed, setWordsGuessed] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * categories.length)];
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];
    return { word, category };
  }, [words]);

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // starts the secret word game
  const startGame = useCallback(
    (selectedDifficulty = difficulty) => {
      clearLetterStates();
      const { word, category } = pickWordAndCategory();
      let wordLetters = word.split('').map((l) => l.toLowerCase());

      setPickedWord(word);
      setPickedCategory(category);
      setLetters(wordLetters);
      setGuesses(selectedDifficulty.lives);

      // Easy mode: auto-reveal first letter
      if (selectedDifficulty.revealFirst && wordLetters.length > 0) {
        const firstLetter = wordLetters[0];
        setGuessedLetters([firstLetter]);
      }

      setGameStage(stages[1].name);
    },
    [pickWordAndCategory, difficulty]
  );

  // called from StartScreen with chosen difficulty
  const handleStart = useCallback(
    (selectedDifficulty) => {
      setDifficulty(selectedDifficulty);
      setScore(0);
      setWordsGuessed(0);
      setGuesses(selectedDifficulty.lives);
      clearLetterStates();

      const { word, category } = pickWordAndCategory();
      const wordLetters = word.split('').map((l) => l.toLowerCase());

      setPickedWord(word);
      setPickedCategory(category);
      setLetters(wordLetters);

      if (selectedDifficulty.revealFirst && wordLetters.length > 0) {
        setGuessedLetters([wordLetters[0]]);
      }

      setGameStage(stages[1].name);
    },
    [pickWordAndCategory]
  );

  // process letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase();

    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((prev) => [...prev, normalizedLetter]);
    } else {
      setWrongLetters((prev) => [...prev, normalizedLetter]);
      setGuesses((prev) => prev - 1);
    }
  };

  // restart — go back to start screen
  const retry = () => {
    setScore(0);
    setWordsGuessed(0);
    setGuesses(difficulty.lives);
    setGameStage(stages[0].name);
    clearLetterStates();
  };

  // check game over
  useEffect(() => {
    if (guesses === 0) {
      clearLetterStates();
      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // check win condition
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    if (
      gameStage === 'game' &&
      uniqueLetters.length > 0 &&
      guessedLetters.length > 0 &&
      uniqueLetters.every((l) => guessedLetters.includes(l))
    ) {
      const earned = Math.round(100 * difficulty.scoreMultiplier);
      setScore((prev) => prev + earned);
      setWordsGuessed((prev) => prev + 1);

      // next word — keep same difficulty, reset guesses, keep score
      clearLetterStates();
      const { word, category } = pickWordAndCategory();
      const wordLetters = word.split('').map((l) => l.toLowerCase());
      setPickedWord(word);
      setPickedCategory(category);
      setLetters(wordLetters);
      setGuesses(difficulty.lives);

      if (difficulty.revealFirst && wordLetters.length > 0) {
        setGuessedLetters([wordLetters[0]]);
      }
    }
  }, [guessedLetters, letters, gameStage, difficulty, pickWordAndCategory]);

  return (
    <div className="App">
      {gameStage === 'start' && <StartScreen startGame={handleStart} />}
      {gameStage === 'game' && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
          difficulty={difficulty}
          wordsGuessed={wordsGuessed}
        />
      )}
      {gameStage === 'end' && (
        <GameOver
          retry={retry}
          score={score}
          difficulty={difficulty}
          wordsGuessed={wordsGuessed}
        />
      )}
    </div>
  );
}

export default App;
