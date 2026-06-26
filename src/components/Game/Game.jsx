import { useState, useRef, useEffect } from 'react';
import styles from './Game.module.css';

const Game = ({
  verifyLetter,
  pickedWord,
  pickedCategory,
  letters,
  guessedLetters,
  wrongLetters,
  guesses,
  score,
  difficulty,
  wordsGuessed,
}) => {
  const [letter, setLetter] = useState('');
  const [shakeInput, setShakeInput] = useState(false);
  const [lastWrong, setLastWrong] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const letterInputRef = useRef(null);

  const maxLives = difficulty.lives;

  useEffect(() => {
    letterInputRef.current?.focus();
  }, []);

  // Shake on new wrong letter
  useEffect(() => {
    if (wrongLetters.length > 0) {
      const newest = wrongLetters[wrongLetters.length - 1];
      setLastWrong(newest);
      setShakeInput(true);
      const t = setTimeout(() => setShakeInput(false), 500);
      return () => clearTimeout(t);
    }
  }, [wrongLetters]);

  // reset hint panel when word changes
  useEffect(() => {
    setShowHint(false);
  }, [letters]);

  const handleSubmit = (e) => {
    e.preventDefault();
    verifyLetter(letter);
    letterInputRef.current.focus();
    setLetter('');
  };

  const categoryEmoji = {
    carro: '🚗', fruta: '🍎', corpo: '🫀',
    computador: '💻', programação: '⌨️', alimento: '🍽️',
  };
  const catEmoji = categoryEmoji[pickedCategory] ?? '🎯';

  const uniqueLetters = [...new Set(letters)];
  const foundCount = guessedLetters.filter((l) => letters.includes(l)).length;
  const progress = uniqueLetters.length > 0 ? (foundCount / uniqueLetters.length) * 100 : 0;

  // Build lives array
  const livesArray = Array.from({ length: maxLives }, (_, i) => i < guesses);

  // Category detail hint (medium+)
  const categoryHints = {
    carro: 'Peça ou componente de veículo',
    fruta: 'Fruta encontrada em feiras',
    corpo: 'Parte ou órgão do corpo humano',
    computador: 'Componente ou periférico de PC',
    programação: 'Linguagem, framework ou ferramenta dev',
    alimento: 'Alimento ou ingrediente culinário',
  };

  return (
    <div
      className={styles.game}
      style={{ '--diff-color': difficulty.color, '--diff-rgb': difficulty.colorRgb }}
    >
      {/* Top bar */}
      <div className={styles.header}>
        <div className={styles.scoreBox}>
          <span className={styles.scoreLabel}>Pontuação</span>
          <span className={styles.scoreValue}>{score}</span>
        </div>

        {/* Difficulty badge */}
        <div className={styles.diffBadge}>
          <span>{difficulty.emoji}</span>
          <span className={styles.diffLabel}>{difficulty.label}</span>
          <span className={styles.diffMult}>×{difficulty.scoreMultiplier}</span>
        </div>

        {/* Lives */}
        <div className={styles.livesBox}>
          {livesArray.map((alive, i) => (
            <span
              key={i}
              className={`${styles.heart} ${alive ? styles.heartAlive : styles.heartDead}`}
              title={alive ? 'Vida restante' : 'Vida perdida'}
            >
              {alive ? '❤️' : '🖤'}
            </span>
          ))}
        </div>
      </div>

      {/* Category badge */}
      <div className={styles.categoryBadge}>
        <span>{catEmoji}</span>
        <span className={styles.categoryText}>{pickedCategory}</span>
        {difficulty.showWordLength && (
          <span className={styles.wordLengthTag}>{letters.length} letras</span>
        )}
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

      {/* Hint panel — easy & medium only */}
      {difficulty.showCategoryHint && (
        <div className={styles.hintPanel}>
          <button
            type="button"
            className={styles.hintToggle}
            onClick={() => setShowHint((v) => !v)}
          >
            💡 {showHint ? 'Ocultar dica' : 'Ver dica'}
          </button>
          {showHint && (
            <p className={styles.hintText}>
              {categoryHints[pickedCategory] ?? `Categoria: ${pickedCategory}`}
            </p>
          )}
        </div>
      )}

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

      {/* Progress */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
      <p className={styles.progressLabel}>
        {foundCount} / {uniqueLetters.length} letras únicas • {wordsGuessed} palavra{wordsGuessed !== 1 ? 's' : ''} acertada{wordsGuessed !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

export default Game;
