export default function GameHeader({ totalScore, round }) {
  return (
    <header className="game-header">
      <h1>Ask & Draw</h1>
      <div className="stats">
        <span className="stat">Round: {round}</span>
        <span className="stat">Score: {totalScore}</span>
      </div>
    </header>
  );
}
