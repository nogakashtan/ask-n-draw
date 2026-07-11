export default function AnswerDisplay({ answer }) {
  return (
    <div className="answer-display">
      <p className="answer-label">Draw this:</p>
      <p className="answer-text">{answer}</p>
    </div>
  );
}
