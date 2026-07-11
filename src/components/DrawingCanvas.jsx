import { useRef, useState, useEffect, useCallback } from 'react';

const COLORS = ['#000000', '#ff0000', '#0066ff', '#00aa00', '#ff9900', '#9933cc', '#ffffff'];
const SIZES = [3, 6, 12, 20];

export default function DrawingCanvas({ onSubmit, loading }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(6);
  const [tool, setTool] = useState('pen');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }, []);

  function saveState() {
    const canvas = canvasRef.current;
    setHistory(prev => [...prev, canvas.toDataURL()]);
  }

  function getPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e) {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pos = getPos(e);

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }

  const stopDraw = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      saveState();
    }
  }, [isDrawing]);

  function handleClear() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  }

  function handleUndo() {
    if (history.length < 2) return;
    const newHistory = history.slice(0, -1);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = newHistory[newHistory.length - 1];
    setHistory(newHistory);
  }

  function handleSubmit() {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    onSubmit(dataUrl);
  }

  return (
    <div className="drawing-section">
      <div className="toolbar">
        <div className="tool-group">
          <button
            className={`tool-btn ${tool === 'pen' ? 'active' : ''}`}
            onClick={() => setTool('pen')}
            title="Pen"
          >
            ✏️
          </button>
          <button
            className={`tool-btn ${tool === 'eraser' ? 'active' : ''}`}
            onClick={() => setTool('eraser')}
            title="Eraser"
          >
            🧹
          </button>
        </div>

        <div className="tool-group colors">
          {COLORS.map(c => (
            <button
              key={c}
              className={`color-btn ${color === c && tool === 'pen' ? 'active' : ''}`}
              style={{ backgroundColor: c }}
              onClick={() => { setColor(c); setTool('pen'); }}
              title={c}
            />
          ))}
        </div>

        <div className="tool-group sizes">
          {SIZES.map(s => (
            <button
              key={s}
              className={`size-btn ${brushSize === s ? 'active' : ''}`}
              onClick={() => setBrushSize(s)}
              title={`${s}px`}
            >
              <span className="size-dot" style={{ width: s, height: s }} />
            </button>
          ))}
        </div>

        <div className="tool-group actions">
          <button onClick={handleUndo} disabled={history.length < 2} title="Undo">
            ↩
          </button>
          <button onClick={handleClear} title="Clear">
            🗑
          </button>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="canvas"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />

      <button
        className="submit-drawing"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Judging...' : 'Submit Drawing'}
      </button>
    </div>
  );
}
