import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Flame, Sparkles, Moon, Sun, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Info, Eye } from 'lucide-react';
import { PROFILE_INFO } from '../data/profileData';

type Mode = 'svg-view' | 'interactive-game';

export const SnakeContributionViewer: React.FC = () => {
  const [mode, setMode] = useState<Mode>('svg-view');
  const [isDarkSvg, setIsDarkSvg] = useState<boolean>(true);
  const [imgKey, setImgKey] = useState<number>(0);

  // Interactive Game State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('snake_highscore') || '0', 10);
  });
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Grid constants (16 rows x 40 cols for compact contribution grid)
  const ROWS = 10;
  const COLS = 35;
  const [snake, setSnake] = useState<{ x: number; y: number }[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);
  const [food, setFood] = useState<{ x: number; y: number }>({ x: 15, y: 5 });
  const [direction, setDirection] = useState<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  const directionRef = useRef<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'>('RIGHT');
  directionRef.current = direction;

  // Generate initial random contribution heatmap levels
  const [gridHeatmap] = useState<number[][]>(() => {
    const grid: number[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: number[] = [];
      for (let c = 0; c < COLS; c++) {
        const rand = Math.random();
        if (rand > 0.85) row.push(4);
        else if (rand > 0.7) row.push(3);
        else if (rand > 0.5) row.push(2);
        else if (rand > 0.25) row.push(1);
        else row.push(0);
      }
      grid.push(row);
    }
    return grid;
  });

  const getHeatmapColor = (level: number) => {
    switch (level) {
      case 4: return 'bg-emerald-400';
      case 3: return 'bg-emerald-600';
      case 2: return 'bg-emerald-800';
      case 1: return 'bg-emerald-950/80 border border-emerald-800/40';
      default: return 'bg-zinc-900 border border-zinc-800/60';
    }
  };

  const spawnFood = (currentSnake: { x: number; y: number }[]) => {
    let newFood: { x: number; y: number };
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * COLS),
        y: Math.floor(Math.random() * ROWS),
      };
      if (!currentSnake.some((s) => s.x === newFood.x && s.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  };

  const resetGame = () => {
    const initialSnake = [
      { x: 5, y: 5 },
      { x: 4, y: 5 },
      { x: 3, y: 5 },
    ];
    setSnake(initialSnake);
    setDirection('RIGHT');
    directionRef.current = 'RIGHT';
    setFood(spawnFood(initialSnake));
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  // Keyboard navigation for interactive game
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode !== 'interactive-game') return;

      if (['ArrowUp', 'KeyW'].includes(e.code) && directionRef.current !== 'DOWN') {
        e.preventDefault();
        setDirection('UP');
      } else if (['ArrowDown', 'KeyS'].includes(e.code) && directionRef.current !== 'UP') {
        e.preventDefault();
        setDirection('DOWN');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code) && directionRef.current !== 'RIGHT') {
        e.preventDefault();
        setDirection('LEFT');
      } else if (['ArrowRight', 'KeyD'].includes(e.code) && directionRef.current !== 'LEFT') {
        e.preventDefault();
        setDirection('RIGHT');
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (gameOver) {
          resetGame();
        } else {
          setIsPlaying((prev) => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, gameOver]);

  // Game tick loop
  useEffect(() => {
    if (!isPlaying || gameOver || mode !== 'interactive-game') return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] };
        const curDir = directionRef.current;

        if (curDir === 'UP') head.y -= 1;
        if (curDir === 'DOWN') head.y += 1;
        if (curDir === 'LEFT') head.x -= 1;
        if (curDir === 'RIGHT') head.x += 1;

        // Collision with boundary
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        // Collision with self
        if (prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Eat food
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => {
            const nextScore = s + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('snake_highscore', nextScore.toString());
            }
            return nextScore;
          });
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [isPlaying, gameOver, food, highScore, mode]);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🐍</span>
            <h2 className="text-lg font-bold text-white tracking-tight">GitHub Contribution Grid Snake</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Automated via GitHub Actions (<code className="text-emerald-400 font-mono">.github/workflows/snake.yml</code>) by Platane/snk
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setMode('svg-view')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                mode === 'svg-view'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              SVG Animation
            </button>
            <button
              onClick={() => {
                setMode('interactive-game');
                if (!isPlaying && !gameOver) resetGame();
              }}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                mode === 'interactive-game'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              Play Mini-Game
            </button>
          </div>
        </div>
      </div>

      {/* SVG View Mode */}
      {mode === 'svg-view' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDarkSvg(!isDarkSvg)}
                className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition flex items-center gap-1.5 font-medium"
              >
                {isDarkSvg ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
                <span>Palette: {isDarkSvg ? 'Dark Dracula' : 'Light Classic'}</span>
              </button>

              <button
                onClick={() => setImgKey((k) => k + 1)}
                className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition flex items-center gap-1.5 font-medium"
                title="Restart SVG animation loop"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Replay Animation</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Synced with GitHub branch: <code className="text-zinc-300">output</code>
            </span>
          </div>

          <div className="relative p-3 sm:p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center min-h-[160px] overflow-x-auto">
            <img
              key={imgKey}
              src={isDarkSvg ? PROFILE_INFO.snakeDarkSvg : PROFILE_INFO.snakeLightSvg}
              alt="GitHub Contribution Grid Snake"
              className="max-w-full h-auto object-contain rounded select-none filter contrast-105"
              onError={(e) => {
                // Fallback rendering if raw github url rate limits or is offline
                const target = e.currentTarget;
                target.src = 'https://raw.githubusercontent.com/Platane/snk/master/packages/action/example/github-contribution-grid-snake.svg';
              }}
            />
          </div>

          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-zinc-200">How this works:</span> The GitHub Actions workflow runs every midnight (<code className="text-emerald-400 font-mono">cron: "0 0 * * *"</code>), pulls Emiliano's contribution history via private token, generates an animated SVG path of a snake gobbling up commit blocks, and commits the graphic to the <code className="text-indigo-300 font-mono">output</code> branch for README rendering.
            </div>
          </div>
        </div>
      )}

      {/* Interactive Snake Mini Game Mode */}
      {mode === 'interactive-game' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Game Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-mono">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                <span className="text-zinc-400">Score:</span>
                <span className="text-white font-bold text-sm">{score}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-zinc-400">Best:</span>
                <span className="text-emerald-400 font-bold text-sm">{highScore}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetGame}
                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold transition flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                {gameOver ? 'Play Again' : 'Restart'}
              </button>
            </div>
          </div>

          {/* Game Board Grid */}
          <div className="relative p-3 rounded-xl bg-zinc-950 border border-zinc-800 overflow-x-auto flex justify-center items-center">
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: ROWS }).map((_, r) => (
                <React.Fragment key={r}>
                  {Array.from({ length: COLS }).map((_, c) => {
                    const isHead = snake[0]?.x === c && snake[0]?.y === r;
                    const isBody = snake.slice(1).some((s) => s.x === c && s.y === r);
                    const isFood = food.x === c && food.y === r;
                    const heatLevel = gridHeatmap[r][c];

                    let cellClass = getHeatmapColor(heatLevel);

                    if (isHead) {
                      cellClass = 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] scale-110 z-10';
                    } else if (isBody) {
                      cellClass = 'bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]';
                    } else if (isFood) {
                      cellClass = 'bg-amber-400 animate-bounce shadow-[0_0_8px_rgba(251,191,36,0.8)] scale-125 z-10';
                    }

                    return (
                      <div
                        key={`${r}-${c}`}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[3px] transition-colors duration-75 ${cellClass}`}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* Game Over Overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
                <div className="text-2xl font-black text-rose-400 mb-1">GAME OVER</div>
                <p className="text-xs text-zinc-300 mb-3 font-mono">
                  Final Commits Eaten: <span className="text-emerald-400 font-bold">{score / 10}</span> ({score} pts)
                </p>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Try Again (Press Space)
                </button>
              </div>
            )}
          </div>

          {/* Onscreen Controls for Mobile */}
          <div className="flex flex-col items-center gap-1.5 pt-2 sm:hidden">
            <button
              onClick={() => directionRef.current !== 'DOWN' && setDirection('UP')}
              className="p-2.5 bg-zinc-800 active:bg-emerald-600 rounded-lg text-white"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div className="flex gap-4">
              <button
                onClick={() => directionRef.current !== 'RIGHT' && setDirection('LEFT')}
                className="p-2.5 bg-zinc-800 active:bg-emerald-600 rounded-lg text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => directionRef.current !== 'UP' && setDirection('DOWN')}
                className="p-2.5 bg-zinc-800 active:bg-emerald-600 rounded-lg text-white"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => directionRef.current !== 'LEFT' && setDirection('RIGHT')}
                className="p-2.5 bg-zinc-800 active:bg-emerald-600 rounded-lg text-white"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 text-center font-mono">
            Use <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">W</kbd> <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">A</kbd> <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">S</kbd> <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">D</kbd> or arrow keys to steer. Press Space to pause.
          </div>
        </div>
      )}
    </div>
  );
};
