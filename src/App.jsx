import { useState } from 'react';
import GameHeader from './components/GameHeader';
import QuestionForm from './components/QuestionForm';
import AnswerDisplay from './components/AnswerDisplay';
import DrawingCanvas from './components/DrawingCanvas';
import ScoreDisplay from './components/ScoreDisplay';
const API_BASE = '/api';

export default function App() {
  const [phase, setPhase] = useState('asking');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [totalScore, setTotalScore] = useState(0);
  const [round, setRound] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAsk(q) {
    setLoading(true);
    setError('');
    setQuestion(q);

    try {
      const res = await fetch(`${API_BASE}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnswer(data.answer);
      setPhase('drawing');
    } catch (err) {
      setError(err.message || 'Failed to get answer');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitDrawing(imageDataUrl) {
    setLoading(true);
    setError('');
    setPhase('judging');

    try {
      const res = await fetch(`${API_BASE}/judge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer, image: imageDataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScore(data.score);
      setFeedback(data.feedback);
      setTotalScore(prev => prev + data.score);
      setPhase('scored');
    } catch (err) {
      setError(err.message || 'Failed to judge drawing');
      setPhase('drawing');
    } finally {
      setLoading(false);
    }
  }

  function handleNextRound() {
    setPhase('asking');
    setQuestion('');
    setAnswer('');
    setScore(null);
    setFeedback('');
    setRound(prev => prev + 1);
  }

  return (
    <div className="app">
      <GameHeader totalScore={totalScore} round={round} />

      {error && <div className="error">{error}</div>}

      <main className="game-area">
        {phase === 'asking' && (
          <QuestionForm onSubmit={handleAsk} loading={loading} />
        )}

        {(phase === 'drawing' || phase === 'judging') && (
          <>
            <div className="question-reminder">
              <span className="label">Q:</span> {question}
            </div>
            <AnswerDisplay answer={answer} />
            <DrawingCanvas onSubmit={handleSubmitDrawing} loading={loading} />
          </>
        )}

        {phase === 'scored' && (
          <>
            <div className="question-reminder">
              <span className="label">Q:</span> {question}
            </div>
            <AnswerDisplay answer={answer} />
            <ScoreDisplay
              score={score}
              feedback={feedback}
              onNextRound={handleNextRound}
            />
          </>
        )}
      </main>
    </div>
  );
}
