import React, { useState, useEffect, useCallback, useRef } from 'react';
import './maze.css';

const GRID_SIZE = 10;
const CELL_SIZE = 36; 

interface MazeAirplaneGameProps {

  onComplete: (win: boolean) => void;
//  onFinish: (win: boolean) => void; 

}

 export const MazeAirplaneGame: React.FC<MazeAirplaneGameProps> = ({ onFinish }) => {
  const [maze, setMaze] = useState([]);
  const [player, setPlayer] = useState({ x: 0, y: 0 });
  const [targetStep, setTargetStep] = useState(0);
  const [gameStatus, setGameStatus] = useState('playing'); 
  const [scenarioData, setScenarioData] = useState(null);
  const closeResult = () => {
        onFinish(true);
    };

  const touchStart = useRef(null);

  // 1. Fetch Scenario with Emergency Fallback
  useEffect(() => {
    fetch('AdventurePassport/public/games/MazeAirplane/scenarios.json')
      .then(res => res.json())
      .then(data => {
        const selected = data[Math.floor(Math.random() * data.length)];
        setScenarioData(selected);
      })
      .catch(() => {
        setScenarioData({
          theme: "Manual Navigation",
          description: "ATC Link offline. Proceed to local waypoints.",
          checkpoints: [{name: "Vect-A", x: 2, y: 2}, {name: "Vect-B", x: 7, y: 4}, {name: "Base", x: 9, y: 9}]
        });
      });
  }, []);

  // 2. Maze Gen (DFS + Braid Logic)
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

    const getNeighbors = (x, y, g) => {
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

    // Punch 20 extra holes for non-linear paths
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

  // 3. Movement Logic
  const movePlayer = useCallback((direction) => {
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

  // 4. Waypoint Observer
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

  //    // 4.5 Win Trigger                                                                                     │
  //    useEffect(() => {                                                                                      │
  //      if (gameStatus === 'won') {                                                                          │
  //        setTimeout(() => onFinish(true), 500);                                                             │
  //      }                                                                                                    │
  //  }, [gameStatus, onFinish]); 

  // 5. Swipe Controls
  useEffect(() => {
    const start = (e) => touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const end = (e) => {
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

  if (!scenarioData || maze.length === 0) return <div className="loading">SYNCING RADAR...</div>;

  return (
    <div className="aviation-app">
      <div className="hud">
        <h2>{scenarioData.theme.toUpperCase()}</h2>
        <div className="progress">
          {scenarioData.checkpoints.map((_, i) => (
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
              const cpIdx = scenarioData.checkpoints.findIndex(c => c.x === x && c.y === y);
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
                      {/* //change .name */}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
        <div className="plane" style={{ top: player.y * CELL_SIZE + 4, left: player.x * CELL_SIZE + 4 }}>✈️</div>
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
            <h1>TOUCHDOWN! 🛬</h1>
            <p>Flight Plan Successfully Cleared.</p>
            <button onClick={closeResult} >Continue</button>
          </div>
        </div>
      )} 
    </div>
  );
};
