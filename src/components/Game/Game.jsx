import { useState, useRef, useEffect } from 'react';
import styles from './Game.module.css';

const MAX_GUESSES = 3;

const Game = ({
  verifyLetter,
  pickedWord,
  pickedCategory,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
}) => {
  const [letter, setLetter] = useState('');
  const [shakeInput, setShakeInput] = useState(false);
  const [lastWrong, setLastWrong] = useState(null);
  const letterInputRef = useRef(null);

  // Focus input on mount
  useEffect(() => {
    letterInputRef.current?.focus();
  }, []);

  // Detect new wrong letter to trigger shake
  useEffect(() => {
    if (wrongLetters.length > 0) {
      const newest = wrongLetters[wrongLetters.length - 1];
      setLastWrong(newest);
      setShakeInput(true);
      const t = setTimeout(() => setShakeInput(false), 500);
      return () => clearTimeout(t);
    }
  }, [wrongLetters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyLetter(letter);
    letterInputRef.current.focus();
    setLetter('');
  };

  // Build heart/life icons
  const livesArray = Array.from({ length: MAX_GUESSES }, (_, i) => i < guesses);

  // Category emoji map
  const categoryEmoji = {
    carro: '🚗',
    fruta: '🍎',
    corpo: '🫀',
    computador: '💻',
    programação: '⌨️',
    alimento: '🍽️',
  };
  const emoji = categoryEmoji[pickedCategory] ?? '🎯';

  return (
    <div className={styles.game}>
      {/* Header strip */}
      <div className={styles.header}>
        <div className={styles.scoreBox}>
          <span className={styles.scoreLabel}>Pontuação</span>
          <span className={styles.scoreValue}>{score}</span>
        </div>

        <div className={styles.livesBox}>
          {livesArray.map((alive, i) => (
            <span
              key={i}
              className={`${styles.heart} ${alive ? styles.heartAlive : styles.heartDead}`}
            >
              {alive ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
      </div>

      {/* Category badge */}
      <div className={styles.categoryBadge}>
        <span className={styles.categoryEmoji}>{emoji}</span>
        <span className={styles.categoryText}>{pickedCategory}</span>
      </div>

      <h1 className={styles.title}>Adivinhe a palavra</h1>

      {/* Word display */}
      <div className={styles.wordContainer}>
        {letters.map((l, i) =>
          guessedLetters.includes(l) ? (
            <span key={i} className={`${styles.letter} ${styles.letterReveal}`}>
              {l}
            </span>
          ) : (
            <span key={i} className={styles.blankSquare}>
              <span className={styles.blankDot} />
            </span>
          )
        )}
      </div>

      {/* Input section */}
      <div className={styles.inputSection}>
        <p className={styles.inputLabel}>Digite uma letra</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="letter"
            maxLength="1"
            required
            onChange={(e) => setLetter(e.target.value)}
            value={letter}
            ref={letterInputRef}
            className={`${styles.letterInput} ${shakeInput ? styles.shake : ''}`}
            autoComplete="off"
            autoCapitalize="none"
            placeholder="?"
          />
          <button type="submit" className={styles.guessButton}>
            Tentar
          </button>
        </form>
      </div>

      {/* Wrong letters */}
      <div className={styles.wrongSection}>
        <p className={styles.wrongLabel}>Letras erradas:</p>
        <div className={styles.wrongLetters}>
          {wrongLetters.length === 0 ? (
            <span className={styles.noWrong}>Nenhuma ainda</span>
          ) : (
            wrongLetters.map((l, i) => (
              <span
                key={i}
                className={`${styles.wrongBadge} ${l === lastWrong ? styles.wrongNew : ''}`}
              >
                {l.toUpperCase()}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{
            width: `${
              letters.length > 0
                ? (guessedLetters.filter((l) => letters.includes(l)).length /
                    [...new Set(letters)].length) *
                  100
                : 0
            }%`,
          }}
        />
      </div>
      <p className={styles.progressLabel}>
        {guessedLetters.filter((l) => letters.includes(l)).length} /{' '}
        {[...new Set(letters)].length} letras encontradas
      </p>
    </div>
  );
};

export default Game;
