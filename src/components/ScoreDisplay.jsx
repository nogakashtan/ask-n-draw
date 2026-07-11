export default function ScoreDisplay({ score, feedback, onNextRound }) {
  const emoji = score >= 8 ? '🎉' : score >= 5 ? '👍' : score >= 3 ? '🤔' : '😅';

  return (
    <div className="score-display">
      <div className="score-emoji">{emoji}</div>
      <div className="score-value">{score} / 10</div>
      <p className="score-feedback">{feedback}</p>
      <button className="next-round" onClick={onNextRound}>
        Next Question
      </button>
    </div>
  );
}
