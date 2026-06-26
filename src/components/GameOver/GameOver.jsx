import { useEffect, useRef } from 'react';
import styles from './GameOver.module.css';

const GameOver = ({ retry, score }) => {
  const containerRef = useRef(null);

  // Confetti burst on mount
  useEffect(() => {
    const colors = ['#a855f7', '#ec4899', '#06b6d4', '#facc15', '#22c55e'];
    const container = containerRef.current;
    if (!container) return;

    const PIECE_COUNT = 60;
    const pieces = [];

    for (let i = 0; i < PIECE_COUNT; i++) {
      const piece = document.createElement('div');
      piece.className = styles.confetti;

      const color = colors[Math.floor(Math.random() * colors.length)];
      const isCircle = Math.random() > 0.5;
      const size = Math.random() * 8 + 5;

      piece.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${isCircle ? size : size * 0.6}px;
        background: ${color};
        border-radius: ${isCircle ? '50%' : '2px'};
        left: ${Math.random() * 100}%;
        top: -10px;
        opacity: 1;
        pointer-events: none;
        transform: rotate(${Math.random() * 360}deg);
        animation: confettiFall ${1.5 + Math.random() * 2}s ease-in ${Math.random() * 0.8}s forwards;
      `;

      container.appendChild(piece);
      pieces.push(piece);
    }

    return () => pieces.forEach((p) => p.remove());
  }, []);

  const getRank = (s) => {
    if (s >= 800) return { emoji: '👑', label: 'Mestre!', color: '#facc15' };
    if (s >= 400) return { emoji: '🔥', label: 'Incrível!', color: '#fb923c' };
    if (s >= 200) return { emoji: '⭐', label: 'Bom jogo!', color: '#a855f7' };
    if (s >= 100) return { emoji: '🎯', label: 'Continue!', color: '#06b6d4' };
    return { emoji: '💪', label: 'Tente mais!', color: '#94a3b8' };
  };

  const rank = getRank(score);

  return (
    <div className={styles.gameOver} ref={containerRef}>
      {/* Glow orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* Icon */}
      <div className={styles.iconWrapper}>
        <span className={styles.rankEmoji}>{rank.emoji}</span>
        <div className={styles.iconRing} />
      </div>

      <h1 className={styles.title}>Fim de Jogo!</h1>

      <div className={styles.rankBadge} style={{ '--rank-color': rank.color }}>
        {rank.label}
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
          <span className={styles.statNum}>{Math.floor(score / 100)}</span>
          <span className={styles.statLabel}>Palavras</span>
        </div>
        <div className={styles.statDivider} />
        <div className={styles.statItem}>
          <span className={styles.statNum}>{score > 0 ? '100' : '0'}</span>
          <span className={styles.statLabel}>Pts/Palavra</span>
        </div>
      </div>

      <button onClick={retry} className={styles.retryBtn}>
        🔄 Jogar Novamente
      </button>
    </div>
  );
};

export default GameOver;
