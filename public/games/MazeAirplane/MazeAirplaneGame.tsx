import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../../../src/css/maze.css';

const GRID_SIZE = 7;
const CELL_SIZE = 36;
const INITIAL_TIME = 60; // Added constant for metadata calculation

interface MazeAirplaneGameProps {
  onComplete: (win: boolean, metadata?: Record<string, any>) => void;
}

export const MazeAirplaneGame: React.FC<MazeAirplaneGameProps> = ({ onComplete }) => {
  const [maze, setMaze] = useState<any[][]>([]);
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [targetStep, setTargetStep] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');
  const [scenarioData, setScenarioData] = useState<any>(null);
  const [screen, setScreen] = useState<'intro' | 'game'>('intro');
  
  // Timer States
  const [seconds, setSeconds] = useState(INITIAL_TIME);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // 1. Fetch Scenario with Emergency Fallback (Project Dev Theme)
  useEffect(() => {
    fetch('/games/MazeAirplane/scenarios.json')
      .then(res => res.json())
      .then(data => {
        const selected = data[Math.floor(Math.random() * data.length)];
        setScenarioData(selected);
      })
      .catch(() => {
        setScenarioData({
          theme: "Emergency Hotfix",
          description: "Production is down! Trace logs and redeploy.",
          checkpoints: [
            { name: "Log Analysis", x: 1, y: 2 },
            { name: "Local Patch", x: 5, y: 1 },
            { name: "Prod Deploy", x: 6, y: 6 }
          ]
        });
      });
  }, []);

  // 2. Timer Logic (Updated for Loss Metadata)
  useEffect(() => {
    if (gameStatus === 'playing' && screen === 'game') {
      if (seconds === 0) {
        // --- METADATA UPDATE: LOSS CONDITION ---
        onComplete(false, {
          gameType: "maze",
          scenarioTheme: scenarioData?.theme || "Unknown",
          totalCheckpoints: scenarioData?.checkpoints?.length || 0,
          completedCheckpoints: targetStep,
          timeRemaining: 0,
          timeTaken: INITIAL_TIME,
          gridSize: GRID_SIZE,
          success: false
        });
        return;
      }
      timerRef.current = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameStatus, screen, seconds, onComplete, scenarioData, targetStep]);

  // 3. Maze Generation (DFS + Braid Logic)
  const generateMaze = useCallback(() => {
    let grid = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => ({
        visited: false,
        walls: { top: true, right: true, bottom: true, left: true },
      }))
    );
    let stack = [];
    let current = { x: 0, y: 0 };
    grid[0][0].visited = true;

    const getNeighbors = (x: number, y: number, g: any[][]) => {
      const neighbors = [];
      if (y > 0 && !g[y - 1][x].visited) neighbors.push({ x, y: y - 1, dir: 'top' });
      if (x < GRID_SIZE - 1 && !g[y][x + 1].visited) neighbors.push({ x: x + 1, y, dir: 'right' });
      if (y < GRID_SIZE - 1 && !g[y + 1][x].visited) neighbors.push({ x, y: y + 1, dir: 'bottom' });
      if (x > 0 && !g[y][x - 1].visited) neighbors.push({ x: x - 1, y, dir: 'left' });
      return neighbors;
    };

    let visitedCount = 1;
    while (visitedCount < GRID_SIZE * GRID_SIZE) {
      let neighbors = getNeighbors(current.x, current.y, grid);
      if (neighbors.length > 0) {
        let next = neighbors[Math.floor(Math.random() * neighbors.length)];
        if (next.dir === 'top') { grid[current.y][current.x].walls.top = false; grid[next.y][next.x].walls.bottom = false; }
        else if (next.dir === 'right') { grid[current.y][current.x].walls.right = false; grid[next.y][next.x].walls.left = false; }
        else if (next.dir === 'bottom') { grid[current.y][current.x].walls.bottom = false; grid[next.y][next.x].walls.top = false; }
        else if (next.dir === 'left') { grid[current.y][current.x].walls.left = false; grid[next.y][next.x].walls.right = false; }
        grid[next.y][next.x].visited = true;
        stack.push(current);
        current = next;
        visitedCount++;
      } else if (stack.length > 0) { current = stack.pop(); }
      else break;
    }

    // Punch 10 extra holes for non-linear paths
    for (let i = 0; i < 20; i++) {
      let rx = Math.floor(Math.random() * (GRID_SIZE - 1));
      let ry = Math.floor(Math.random() * (GRID_SIZE - 1));
      if (Math.random() > 0.5) {
        grid[ry][rx].walls.right = false; grid[ry][rx + 1].walls.left = false;
      } else {
        grid[ry][rx].walls.bottom = false; grid[ry + 1][rx].walls.top = false;
      }
    }
    setMaze(grid);
  }, []);

  useEffect(() => { generateMaze(); }, [generateMaze]);

  // 4. Movement Logic
  const movePlayer = useCallback((direction: string) => {
    if (gameStatus === 'won' || !scenarioData || maze.length === 0) return;
    setPlayer((prev) => {
      const cell = maze[prev.y]?.[prev.x];
      if (!cell) return prev;
      let next = { ...prev };
      if (direction === 'UP' && prev.y > 0 && !cell.walls.top) next.y -= 1;
      else if (direction === 'DOWN' && prev.y < GRID_SIZE - 1 && !cell.walls.bottom) next.y += 1;
      else if (direction === 'LEFT' && prev.x > 0 && !cell.walls.left) next.x -= 1;
      else if (direction === 'RIGHT' && prev.x < GRID_SIZE - 1 && !cell.walls.right) next.x += 1;
      return next;
    });
  }, [maze, scenarioData, gameStatus]);

  // 5. Waypoint Observer
  useEffect(() => {
    if (!scenarioData || gameStatus === 'won') return;
    const cp = scenarioData.checkpoints;
    const target = cp[targetStep];
    if (player.x === target?.x && player.y === target?.y) {
      if (targetStep === cp.length - 1) {
        setTargetStep(prev => prev + 1);
        setTimeout(() => setGameStatus('won'), 250);
      } else {
        setTargetStep(prev => prev + 1);
      }
    }
  }, [player, targetStep, scenarioData, gameStatus]);

  // Win Trigger (Updated for Success Metadata)
  useEffect(() => {
    if (gameStatus === 'won') {
      // --- METADATA UPDATE: SUCCESS CONDITION ---
      onComplete(true, {
        gameType: "maze",
        scenarioTheme: scenarioData?.theme || "Unknown",
        totalCheckpoints: scenarioData?.checkpoints?.length || 0,
        completedCheckpoints: scenarioData?.checkpoints?.length || 0,
        timeRemaining: seconds,
        timeTaken: INITIAL_TIME - seconds,
        gridSize: GRID_SIZE,
        success: true
      });
    }
  }, [gameStatus, onComplete, seconds, scenarioData]);

  // 6. Swipe Controls
  useEffect(() => {
    const start = (e: any) => touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const end = (e: any) => {
      if (!touchStart.current) return;
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 30) {
        if (Math.abs(dx) > Math.abs(dy)) movePlayer(dx > 0 ? 'RIGHT' : 'LEFT');
        else movePlayer(dy > 0 ? 'DOWN' : 'UP');
      }
      touchStart.current = null;
    };
    window.addEventListener('touchstart', start, { passive: false });
    window.addEventListener('touchend', end);
    return () => { window.removeEventListener('touchstart', start); window.removeEventListener('touchend', end); };
  }, [movePlayer]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!scenarioData || maze.length === 0) return <div className="loading">SYNCING RADAR...</div>;

  if (screen === 'intro') {
    return (
      <div className="flex items-center justify-center min-h-[700px] bg-gray-900 text-white p-4 animate-fade-in">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
          <h2 className="text-4xl font-bold mb-4 text-yellow-400">{scenarioData.theme.toUpperCase()}</h2>
          <p className="text-mb-gray-300 mb-8 leading-relaxed">{scenarioData.description}</p>
          <button
            onClick={() => setScreen('game')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg text-xl transition duration-300 ease-in-out transform hover:scale-105"
          >
            Start Mission
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="aviation-app"
      style={{ 
        backgroundColor: 'var(--bg-dark)', 
        color: 'white', 
        fontFamily: "'Courier New', monospace", 
        overflow: 'hidden',
      }}>
      <div className="hud">
        <div className="timer-display">TIME REMAINING: <span>{formatTime(seconds)}</span></div>
        <h2>{scenarioData.theme.toUpperCase()}</h2>
        <div className="progress">
          {scenarioData.checkpoints.map((_: any, i: number) => (
            <div key={i} className={`seg ${i < targetStep ? 'on' : ''}`} />
          ))}
        </div>
        <div className="target-info">
          STATUS: <span>{targetStep >= scenarioData.checkpoints.length ? "MISSION COMPLETE" : `WP ${targetStep + 1}: ${scenarioData.checkpoints[targetStep]?.name}`}</span>
        </div>
      </div>

      <div className="radar-view" style={{ touchAction: 'none' }}>
        {maze.map((row, y) => (
          <div key={y} className="r-row">
            {row.map((cell, x) => {
              const cpIdx = scenarioData.checkpoints.findIndex((c: any) => c.x === x && c.y === y);
              const isCurrent = cpIdx === targetStep;
              const isDone = cpIdx !== -1 && cpIdx < targetStep;

              return (
                <div key={x} className={`r-cell 
                  ${cell.walls.top ? 'tw' : ''} ${cell.walls.right ? 'rw' : ''} 
                  ${cell.walls.bottom ? 'bw' : ''} ${cell.walls.left ? 'lw' : ''}
                  ${isCurrent ? 'pulse' : ''}`}>
                  {cpIdx !== -1 && (
                    <div className={`wp ${isDone ? 'done' : ''}`}>
                      <span className="wp-icon">{isDone ? '✅' : '📡'}</span>
                      <span className="wp-name">{cpIdx + 1}</span> 
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div className="plane" style={{ top: player.y * CELL_SIZE + 4, left: player.x * CELL_SIZE + 4 }}>👨‍💻</div>
      </div>

      <div className="btns">
        <div /><button onClick={() => movePlayer('UP')}>▲</button><div />
        <button onClick={() => movePlayer('LEFT')}>◀</button>
        <button onClick={() => movePlayer('DOWN')}>▼</button>
        <button onClick={() => movePlayer('RIGHT')}>▶</button>
      </div>

      {gameStatus === 'won' && (
        <div className="modal">
          <div className="box">
            <h1>MISSION SUCCESS! 🚀</h1>
            <p>Deployment Time: {formatTime(seconds)}</p>
          </div>
        </div>
      )}
    </div>
  );
};