import express from 'express';
import cors from 'cors';
import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const client = new AnthropicVertex({
  projectId: process.env.ANTHROPIC_VERTEX_PROJECT_ID || 'itpc-gcp-eco-eng-claude',
  region: 'us-east5',
});

app.post('/api/answer', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 256,
      system: 'You are a trivia game assistant. The user asks a question. Give a short, concrete, drawable answer — ideally a single noun or simple object/animal/thing. Just state the answer, nothing else. No explanations, no "The answer is...". Just the thing itself.',
      messages: [{ role: 'user', content: question }],
    });

    const text = response.content.find(b => b.type === 'text');
    res.json({ answer: text?.text ?? 'Unknown' });
  } catch (err) {
    console.error('Answer error:', err.message);
    res.status(500).json({ error: 'Failed to get answer' });
  }
});

app.post('/api/judge', async (req, res) => {
  const { answer, image } = req.body;
  if (!answer || !image) {
    return res.status(400).json({ error: 'Answer and image are required' });
  }

  try {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');

    const response = await client.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 256,
      system: `You are judging a drawing game. The player was asked to draw: "${answer}". Rate the drawing from 0 to 10. Respond ONLY with valid JSON in this exact format: {"score": <number>, "feedback": "<one sentence>"}`,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: `This is my drawing of "${answer}". Please judge it.`,
            },
          ],
        },
      ],
    });

    const text = response.content.find(b => b.type === 'text');
    let raw = text?.text ?? '{"score": 0, "feedback": "Could not judge"}';

    const jsonMatch = raw.match(/\{[\s\S]*"score"[\s\S]*\}/);
    if (jsonMatch) raw = jsonMatch[0];

    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      const scoreMatch = raw.match(/(\d+)\s*\/\s*10/);
      result = { score: scoreMatch ? parseInt(scoreMatch[1]) : 5, feedback: raw.slice(0, 200) };
    }

    res.json({ score: result.score, feedback: result.feedback, maxScore: 10 });
  } catch (err) {
    console.error('Judge error:', err.message);
    res.status(500).json({ error: 'Failed to judge drawing' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
