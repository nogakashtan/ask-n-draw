import { useState } from 'react';

export default function QuestionForm({ onSubmit, loading }) {
  const [question, setQuestion] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim() || loading) return;
    onSubmit(question.trim());
    setQuestion('');
  }

  return (
    <form className="question-form" onSubmit={handleSubmit}>
      <label htmlFor="question">Ask any question:</label>
      <div className="input-row">
        <input
          id="question"
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What is the largest animal on Earth?"
          disabled={loading}
          autoFocus
        />
        <button type="submit" disabled={loading || !question.trim()}>
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </div>
    </form>
  );
}
