import { useState } from 'react';
import { DIFFICULTIES } from '../../data/difficulties';
import styles from './StartScreen.module.css';

const StartScreen = ({ startGame }) => {
  const [selected, setSelected] = useState('medium');

  const diffList = Object.values(DIFFICULTIES);
  const current = DIFFICULTIES[selected];

  return (
    <div className={styles.start}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* Icon */}
      <div className={styles.iconWrapper}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          aria-hidden="true"
        >
          <path d="M216,88H184V56a56,56,0,0,0-112,0V88H40A16,16,0,0,0,24,104V208a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V104A16,16,0,0,0,216,88ZM128,180a12,12,0,1,1,12-12A12,12,0,0,1,128,180Zm36-92H92V56a36,36,0,0,1,72,0Z" />
        </svg>
        <div className={styles.iconGlow} />
      </div>

      {/* Title */}
      <h1 className={styles.title}>
        <span className={styles.titleSecret}>Secret</span>
        <span className={styles.titleWord}>Word</span>
      </h1>

      <p className={styles.subtitle}>
        Descubra a palavra oculta antes de acabar as vidas!
      </p>

      {/* Difficulty selector */}
      <div className={styles.difficultySection}>
        <p className={styles.difficultyLabel}>Escolha a dificuldade</p>
        <div className={styles.difficultyCards}>
          {diffList.map((diff) => (
            <button
              key={diff.id}
              type="button"
              className={`${styles.diffCard} ${selected === diff.id ? styles.diffCardActive : ''}`}
              style={{ '--diff-color': diff.color, '--diff-rgb': diff.colorRgb }}
              onClick={() => setSelected(diff.id)}
            >
              <span className={styles.diffEmoji}>{diff.emoji}</span>
              <span className={styles.diffLabel}>{diff.label}</span>
              <span className={styles.diffDesc}>{diff.description}</span>
              {selected === diff.id && (
                <span className={styles.diffCheck}>✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Hint preview */}
        <div
          className={styles.hintPreview}
          style={{ '--diff-color': current.color, '--diff-rgb': current.colorRgb }}
        >
          <p className={styles.hintPreviewTitle}>
            {current.emoji} {current.label} — O que você ganha:
          </p>
          <ul className={styles.hintList}>
            {current.hints.map((h, i) => (
              <li key={i} className={styles.hintItem}>
                <span className={styles.hintDot} />
                {h}
              </li>
            ))}
            <li className={styles.hintItem}>
              <span className={styles.hintDot} />
              +{Math.round(100 * current.scoreMultiplier)} pts por palavra
            </li>
          </ul>
        </div>
      </div>

      <button
        onClick={() => startGame(current)}
        className={styles.startButton}
        style={{ '--diff-color': current.color }}
      >
        🎮 Começar — {current.label}
      </button>
    </div>
  );
};

export default StartScreen;
