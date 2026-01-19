import React, { useState, useEffect, useCallback, useRef } from 'react';
import './maze.css';

const GRID_SIZE = 10;
const CELL_SIZE = 36;

interface Checkpoint {
  name: string;
  x: number;
  y: number;
}

interface Scenario {
  theme: string;
  description: string;
  checkpoints: Checkpoint[];
}

interface MazeAirplaneGameProps {
  onComplete: (win: boolean) => void;
}

export const MazeAirplaneGame: React.FC<MazeAirplaneGameProps> = ({ onComplete }) => {
  const [maze, setMaze] = useState<any[][]>([]);
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [targetStep, setTargetStep] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won'>('playing');
  const [scenarioData, setScenarioData] = useState<Scenario | null>(null);

  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // 1️⃣ Load scenario
  useEffect(() => {
    fetch('/scenarios.json')
      .then(res => res.json())
      .then(data => {
        const selected = data[Math.floor(Math.random() * data.length)];
        setScenarioData(selected);
      })
      .catch(() => {
        setScenarioData({
          theme: 'Manual Navigation',
          description: 'ATC Link offline. Proceed to local waypoints.',
          checkpoints: [
            { name: 'Vect-A', x: 2, y: 2 },
            { name: 'Vect-B', x: 7, y: 4 },
            { name: 'Base', x: 9, y: 9 }
          ]
        });
      });
  }, []);

  // 2️⃣ Generate maze
  const generateMaze = useCallback(() => {
    let grid = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => ({
        visited: false,
        walls: { top: true, right: true, bottom: true, left: true }
      }))
    );

    let stack: any[] = [];
    let current = { x: 0, y: 0 };
    grid[0][0].visited = true;

    const getNeighbors = (x: number, y: number) => {
      const n = [];
      if (y > 0 && !grid[y - 1][x].visited) n.push({ x, y: y - 1, dir: 'top' });
      if (x < GRID_SIZE - 1 && !grid[y][x + 1].visited) n.push({ x: x + 1, y, dir: 'right' });
      if (y < GRID_SIZE - 1 && !grid[y + 1][x].visited) n.push({ x, y: y + 1, dir: 'bottom' });
      if (x > 0 && !grid[y][x - 1].visited) n.push({ x: x - 1, y, dir: 'left' });
      return n;
    };

    let visited = 1;
    while (visited < GRID_SIZE * GRID_SIZE) {
      const neighbors = getNeighbors(current.x, current.y);
      if (neighbors.length) {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        if (next.dir === 'top') {
          grid[current.y][current.x].walls.top = false;
          grid[next.y][next.x].walls.bottom = false;
        } else if (next.dir === 'right') {
          grid[current.y][current.x].walls.right = false;
          grid[next.y][next.x].walls.left = false;
        } else if (next.dir === 'bottom') {
          grid[current.y][current.x].walls.bottom = false;
          grid[next.y][next.x].walls.top = false;
        } else if (next.dir === 'left') {
          grid[current.y][current.x].walls.left = false;
          grid[next.y][next.x].walls.right = false;
        }
        grid[next.y][next.x].visited = true;
        stack.push(current);
        current = next;
        visited++;
      } else {
        current = stack.pop();
      }
    }

    // extra openings
    for (let i = 0; i < 20; i++) {
      let rx = Math.floor(Math.random() * (GRID_SIZE - 1));
      let ry = Math.floor(Math.random() * (GRID_SIZE - 1));
      if (Math.random() > 0.5) {
        grid[ry][rx].walls.right = false;
        grid[ry][rx + 1].walls.left = false;
      } else {
        grid[ry][rx].walls.bottom = false;
        grid[ry + 1][rx].walls.top = false;
      }
    }

    setMaze(grid);
  }, []);

  useEffect(() => {
    generateMaze();
  }, [generateMaze]);

  // 3️⃣ Movement
  const movePlayer = useCallback(
    (dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
      if (gameStatus === 'won' || !scenarioData) return;

      setPlayer(prev => {
        const cell = maze[prev.y]?.[prev.x];
        if (!cell) return prev;

        let next = { ...prev };
        if (dir === 'UP' && !cell.walls.top) next.y--;
        if (dir === 'DOWN' && !cell.walls.bottom) next.y++;
        if (dir === 'LEFT' && !cell.walls.left) next.x--;
        if (dir === 'RIGHT' && !cell.walls.right) next.x++;
        return next;
      });
    },
    [maze, scenarioData, gameStatus]
  );

  // 4️⃣ Checkpoints
  useEffect(() => {
    if (!scenarioData || gameStatus === 'won') return;
    const cp = scenarioData.checkpoints[targetStep];
    if (player.x === cp?.x && player.y === cp?.y) {
      if (targetStep === scenarioData.checkpoints.length - 1) {
        setGameStatus('won');
        setTimeout(() => onComplete(true), 300);
      } else {
        setTargetStep(t => t + 1);
      }
    }
  }, [player, targetStep, scenarioData, gameStatus, onComplete]);

  if (!scenarioData || maze.length === 0) {
    return <div className="loading">SYNCING RADAR...</div>;
  }

  return (
    <div className="aviation-app">
      <div className="radar-view">
        {maze.map((row, y) => (
          <div key={y} className="r-row">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`r-cell
                  ${cell.walls.top ? 'tw' : ''}
                  ${cell.walls.right ? 'rw' : ''}
                  ${cell.walls.bottom ? 'bw' : ''}
                  ${cell.walls.left ? 'lw' : ''}
                `}
              />
            ))}
          </div>
        ))}
        <div
          className="plane"
          style={{ top: player.y * CELL_SIZE + 4, left: player.x * CELL_SIZE + 4 }}
        >
          ✈️
        </div>
      </div>

      <div className="btns">
        <button onClick={() => movePlayer('UP')}>▲</button>
        <button onClick={() => movePlayer('LEFT')}>◀</button>
        <button onClick={() => movePlayer('DOWN')}>▼</button>
        <button onClick={() => movePlayer('RIGHT')}>▶</button>
      </div>
    </div>
  );
};
