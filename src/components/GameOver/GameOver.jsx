import { useEffect, useRef } from 'react';
import styles from './GameOver.module.css';

const GameOver = ({ retry, score, difficulty, wordsGuessed }) => {
  const containerRef = useRef(null);

  // Confetti burst
  useEffect(() => {
    const colors = [difficulty.color, '#ec4899', '#06b6d4', '#facc15', '#f8fafc'];
    const container = containerRef.current;
    if (!container) return;
    const pieces = [];

    for (let i = 0; i < 65; i++) {
      const piece = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const isCircle = Math.random() > 0.5;
      const size = Math.random() * 8 + 5;
      piece.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${isCircle ? size : size * 0.55}px;
        background: ${color};
        border-radius: ${isCircle ? '50%' : '2px'};
        left: ${Math.random() * 100}%;
        top: -12px;
        pointer-events: none;
        transform: rotate(${Math.random() * 360}deg);
        animation: confettiFall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 0.8}s forwards;
      `;
      container.appendChild(piece);
      pieces.push(piece);
    }
    return () => pieces.forEach((p) => p.remove());
  }, [difficulty.color]);

  const getRank = (s) => {
    if (s >= 800) return { emoji: '👑', label: 'Mestre!', color: '#facc15' };
    if (s >= 400) return { emoji: '🔥', label: 'Incrível!', color: '#fb923c' };
    if (s >= 200) return { emoji: '⭐', label: 'Bom jogo!', color: '#a855f7' };
    if (s >= 100) return { emoji: '🎯', label: 'Continue!', color: '#06b6d4' };
    return { emoji: '💪', label: 'Tente mais!', color: '#94a3b8' };
  };

  const rank = getRank(score);
  const ptsPerWord = Math.round(100 * difficulty.scoreMultiplier);

  return (
    <div
      className={styles.gameOver}
      ref={containerRef}
      style={{ '--diff-color': difficulty.color, '--diff-rgb': difficulty.colorRgb }}
    >
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* Rank icon */}
      <div className={styles.iconWrapper}>
        <span className={styles.rankEmoji}>{rank.emoji}</span>
        <div className={styles.iconRing} />
      </div>

      <h1 className={styles.title}>Fim de Jogo!</h1>

      <div className={styles.rankBadge} style={{ '--rank-color': rank.color }}>
        {rank.label}
      </div>

      {/* Difficulty pill */}
      <div className={styles.diffPill}>
        <span>{difficulty.emoji}</span>
        <span>Dificuldade: <strong>{difficulty.label}</strong></span>
        <span className={styles.multTag}>×{difficulty.scoreMultiplier}</span>
      </div>

      {/* Score card */}
      <div className={styles.scoreCard}>
        <p className={styles.scoreLabel}>Pontuação Final</p>
        <p className={styles.scoreValue}>{score}</p>
        <p className={styles.scorePoints}>pontos</p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{wordsGuessed}</span>
          <span className={styles.statLabel}>Palavras</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statNum}>{ptsPerWord}</span>
          <span className={styles.statLabel}>Pts/Palavra</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statNum}>{difficulty.lives}</span>
          <span className={styles.statLabel}>Vidas/Rnd</span>
        </div>
      </div>

      <button onClick={retry} className={styles.retryBtn}>
        🔄 Jogar Novamente
      </button>
    </div>
  );
};

export default GameOver;
