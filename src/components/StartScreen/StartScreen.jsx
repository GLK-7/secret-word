import styles from './StartScreen.module.css';

const StartScreen = ({ startGame }) => {
  return (
    <div className={styles.start}>
      {/* Floating decorative orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* Logo / Icon */}
      <div className={styles.iconWrapper}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          className={styles.icon}
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
        Descubra a palavra oculta antes de acabar as tentativas!
      </p>

      {/* Feature cards */}
      <div className={styles.features}>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>🧠</span>
          <span>Adivinhe letras</span>
        </div>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>🏆</span>
          <span>Acumule pontos</span>
        </div>
        <div className={styles.featureCard}>
          <span className={styles.featureIcon}>⚡</span>
          <span>Várias categorias</span>
        </div>
      </div>

      <button onClick={startGame} className={styles.startButton}>
        <span>🎮 Começar o Jogo</span>
      </button>

      <p className={styles.hint}>Você tem 3 tentativas por palavra</p>
    </div>
  );
};

export default StartScreen;
