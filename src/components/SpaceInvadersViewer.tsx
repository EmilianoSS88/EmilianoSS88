import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Sparkles, Volume2, VolumeX, Eye, Flame, Shield, Crosshair, ArrowLeft, ArrowRight, Zap, Trophy, HelpCircle } from 'lucide-react';
import { PROFILE_INFO } from '../data/profileData';

type ViewMode = 'arcade-game' | 'gif-preview' | 'snake-classic';

interface Invader {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  tier: number; // 1 to 4 (based on github commit intensity)
  maxHp: number;
  hp: number;
  alive: boolean;
  alienType: 0 | 1 | 2 | 3;
}

interface Bullet {
  x: number;
  y: number;
  vy: number;
  isPlayer: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export const SpaceInvadersViewer: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('arcade-game');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [crtEnabled, setCrtEnabled] = useState<boolean>(true);
  const [imgKey, setImgKey] = useState<number>(0);

  // Audio synthesis context
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSynthSound = (type: 'laser' | 'hit' | 'explosion' | 'gameover' | 'victory') => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'laser') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'hit') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.setValueAtTime(220, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'explosion') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'victory') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.4);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  // Canvas Game Engine
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [score, setScore] = useState<number>(0);
  const [wave, setWave] = useState<number>(1);
  const [lives, setLives] = useState<number>(3);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('invaders_highscore') || '0', 10);
  });
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'gameover' | 'victory'>('playing');

  // Game internal refs for 60fps loop
  const playerRef = useRef({ x: 300, y: 350, width: 36, height: 20, speed: 6, vx: 0 });
  const invadersRef = useRef<Invader[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const invaderDirectionRef = useRef<number>(1);
  const invaderSpeedRef = useRef<number>(1.2);
  const lastEnemyShotRef = useRef<number>(0);
  const keysRef = useRef<{ left: boolean; right: boolean; shoot: boolean }>({
    left: false,
    right: false,
    shoot: false,
  });
  const lastPlayerShotRef = useRef<number>(0);

  // Initialize a grid of commit invaders (5 rows x 12 cols)
  const initInvaders = (currentWave: number) => {
    const invaders: Invader[] = [];
    const rows = 5;
    const cols = 12;
    const invWidth = 26;
    const invHeight = 18;
    const startX = 60;
    const startY = 50;
    const paddingX = 14;
    const paddingY = 12;

    let id = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Tiers matching commit depth:
        // Top row = Tier 4 (Boss commits), Middle = Tier 3/2, Bottom = Tier 1 (Light commits)
        let tier = 1;
        let alienType: 0 | 1 | 2 | 3 = 0;
        if (r === 0) {
          tier = 4;
          alienType = 3;
        } else if (r === 1) {
          tier = 3;
          alienType = 2;
        } else if (r === 2 || r === 3) {
          tier = 2;
          alienType = 1;
        } else {
          tier = 1;
          alienType = 0;
        }

        const hp = tier + Math.min(2, Math.floor(currentWave / 2));

        invaders.push({
          id: id++,
          x: startX + c * (invWidth + paddingX),
          y: startY + r * (invHeight + paddingY),
          width: invWidth,
          height: invHeight,
          tier,
          maxHp: hp,
          hp,
          alive: true,
          alienType,
        });
      }
    }
    invadersRef.current = invaders;
    invaderDirectionRef.current = 1;
    invaderSpeedRef.current = 1.0 + currentWave * 0.2;
  };

  const createExplosion = (x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3.5;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 20 + Math.random() * 15,
        color,
      });
    }
  };

  const startNewGame = () => {
    setScore(0);
    setWave(1);
    setLives(3);
    bulletsRef.current = [];
    particlesRef.current = [];
    playerRef.current.x = 280;
    initInvaders(1);
    setGameState('playing');
    setIsPlaying(true);
  };

  const nextWave = () => {
    const nextW = wave + 1;
    setWave(nextW);
    bulletsRef.current = [];
    playerRef.current.x = 280;
    initInvaders(nextW);
    setGameState('playing');
    playSynthSound('victory');
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== 'arcade-game') return;

      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        keysRef.current.left = true;
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        keysRef.current.right = true;
      } else if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        keysRef.current.shoot = true;
      } else if (e.code === 'KeyP') {
        e.preventDefault();
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        keysRef.current.left = false;
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        keysRef.current.right = false;
      } else if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
        keysRef.current.shoot = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [viewMode]);

  // Main Canvas Game Loop
  useEffect(() => {
    if (viewMode !== 'arcade-game') return;
    initInvaders(wave);

    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 600;
    const height = 400;
    canvas.width = width;
    canvas.height = height;

    const gameLoop = () => {
      // Clear screen
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // Starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let i = 0; i < 40; i++) {
        const starX = ((i * 97 + Date.now() * 0.02) % width);
        const starY = (i * 47) % height;
        const starSize = (i % 3 === 0) ? 2 : 1;
        ctx.fillRect(starX, starY, starSize, starSize);
      }

      if (gameState === 'playing') {
        const now = Date.now();

        // 1. Move Player
        const player = playerRef.current;
        if (keysRef.current.left) {
          player.x = Math.max(10, player.x - player.speed);
        }
        if (keysRef.current.right) {
          player.x = Math.min(width - player.width - 10, player.x + player.speed);
        }

        // 2. Player Shoot
        if (keysRef.current.shoot && now - lastPlayerShotRef.current > 220) {
          bulletsRef.current.push({
            x: player.x + player.width / 2,
            y: player.y - 4,
            vy: -7,
            isPlayer: true,
          });
          lastPlayerShotRef.current = now;
          playSynthSound('laser');
        }

        // 3. Move Invaders
        let shouldDrop = false;
        const invaders = invadersRef.current;
        const aliveInvaders = invaders.filter((inv) => inv.alive);

        if (aliveInvaders.length === 0) {
          setGameState('victory');
          playSynthSound('victory');
        }

        // Check horizontal bounds
        for (const inv of aliveInvaders) {
          const nextX = inv.x + invaderSpeedRef.current * invaderDirectionRef.current;
          if (nextX <= 10 || nextX + inv.width >= width - 10) {
            shouldDrop = true;
            break;
          }
        }

        if (shouldDrop) {
          invaderDirectionRef.current *= -1;
          for (const inv of aliveInvaders) {
            inv.y += 12;
            // Invaders reached bunker line
            if (inv.y + inv.height >= player.y) {
              setGameState('gameover');
              playSynthSound('gameover');
            }
          }
          invaderSpeedRef.current += 0.08;
        } else {
          for (const inv of aliveInvaders) {
            inv.x += invaderSpeedRef.current * invaderDirectionRef.current;
          }
        }

        // 4. Enemy Shooting
        if (now - lastEnemyShotRef.current > Math.max(700, 1600 - wave * 150) && aliveInvaders.length > 0) {
          const randomInvader = aliveInvaders[Math.floor(Math.random() * aliveInvaders.length)];
          bulletsRef.current.push({
            x: randomInvader.x + randomInvader.width / 2,
            y: randomInvader.y + randomInvader.height,
            vy: 3.5 + wave * 0.4,
            isPlayer: false,
          });
          lastEnemyShotRef.current = now;
        }

        // 5. Update Bullets & Collisions
        const activeBullets: Bullet[] = [];
        for (const b of bulletsRef.current) {
          b.y += b.vy;

          if (b.y < -10 || b.y > height + 10) continue;

          let bulletConsumed = false;

          if (b.isPlayer) {
            // Check collision with invaders
            for (const inv of aliveInvaders) {
              if (
                b.x >= inv.x &&
                b.x <= inv.x + inv.width &&
                b.y >= inv.y &&
                b.y <= inv.y + inv.height
              ) {
                inv.hp -= 1;
                bulletConsumed = true;
                if (inv.hp <= 0) {
                  inv.alive = false;
                  const pts = inv.tier * 20;
                  setScore((s) => {
                    const newS = s + pts;
                    if (newS > highScore) {
                      setHighScore(newS);
                      localStorage.setItem('invaders_highscore', newS.toString());
                    }
                    return newS;
                  });
                  createExplosion(inv.x + inv.width / 2, inv.y + inv.height / 2, getTierColor(inv.tier), 16);
                  playSynthSound('explosion');
                } else {
                  createExplosion(b.x, b.y, '#34d399', 4);
                  playSynthSound('hit');
                }
                break;
              }
            }
          } else {
            // Enemy bullet vs Player
            if (
              b.x >= player.x &&
              b.x <= player.x + player.width &&
              b.y >= player.y &&
              b.y <= player.y + player.height
            ) {
              bulletConsumed = true;
              createExplosion(player.x + player.width / 2, player.y + player.height / 2, '#ef4444', 20);
              playSynthSound('explosion');
              setLives((l) => {
                const nl = l - 1;
                if (nl <= 0) {
                  setGameState('gameover');
                  playSynthSound('gameover');
                }
                return nl;
              });
            }
          }

          if (!bulletConsumed) {
            activeBullets.push(b);
          }
        }
        bulletsRef.current = activeBullets;

        // 6. Update Particles
        particlesRef.current = particlesRef.current.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.life++;
          return p.life < p.maxLife;
        });
      }

      // --- RENDERING ---

      // Render Invaders (GitHub commit blocks / sprites)
      for (const inv of invadersRef.current) {
        if (!inv.alive) continue;

        const color = getTierColor(inv.tier);
        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = inv.tier >= 3 ? 8 : 2;

        // Draw Retro Space Invader Sprite Shape
        drawInvaderSprite(ctx, inv.x, inv.y, inv.width, inv.height, inv.alienType, inv.hp, inv.maxHp);
      }
      ctx.shadowBlur = 0;

      // Render Player Cannon Ship
      const player = playerRef.current;
      ctx.fillStyle = '#38bdf8'; // Cyan player ship
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      drawPlayerShip(ctx, player.x, player.y, player.width, player.height);
      ctx.shadowBlur = 0;

      // Render Bullets
      for (const b of bulletsRef.current) {
        if (b.isPlayer) {
          ctx.fillStyle = '#4ade80';
          ctx.shadowColor = '#4ade80';
          ctx.shadowBlur = 6;
          ctx.fillRect(b.x - 1.5, b.y - 4, 3, 9);
        } else {
          ctx.fillStyle = '#f87171';
          ctx.shadowColor = '#f87171';
          ctx.shadowBlur = 6;
          ctx.fillRect(b.x - 1.5, b.y, 3, 7);
        }
      }
      ctx.shadowBlur = 0;

      // Render Particles
      for (const p of particlesRef.current) {
        const alpha = 1 - p.life / p.maxLife;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x, p.y, 2.5, 2.5);
      }
      ctx.globalAlpha = 1.0;

      // HUD & Defense line
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.25)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height - 30);
      ctx.lineTo(width, height - 30);
      ctx.stroke();
      ctx.setLineDash([]);

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [viewMode, gameState, wave, highScore]);

  const getTierColor = (tier: number) => {
    switch (tier) {
      case 4: return '#34d399'; // Bright emerald (Tier 4 commits)
      case 3: return '#059669'; // Medium emerald (Tier 3)
      case 2: return '#047857'; // Deep emerald (Tier 2)
      default: return '#064e3b'; // Dark emerald (Tier 1)
    }
  };

  const drawInvaderSprite = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    type: number,
    hp: number,
    maxHp: number
  ) => {
    // Pixel matrix drawing for retro alien look
    const cellW = w / 7;
    const cellH = h / 5;

    // Outer commit square background
    ctx.fillRect(x, y, w, h);

    // Inner alien eye/antennae details
    ctx.fillStyle = '#09090b';
    ctx.fillRect(x + cellW * 2, y + cellH, cellW, cellH);
    ctx.fillRect(x + cellW * 4, y + cellH, cellW, cellH);

    // Mouth / bottom notches
    ctx.fillRect(x, y + cellH * 4, cellW, cellH);
    ctx.fillRect(x + cellW * 6, y + cellH * 4, cellW, cellH);

    // HP Bar if damaged
    if (hp < maxHp) {
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x, y - 3, w, 2);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(x, y - 3, (w * hp) / maxHp, 2);
    }
  };

  const drawPlayerShip = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) => {
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y); // Cannon tip
    ctx.lineTo(x + w, y + h); // Right wing
    ctx.lineTo(x + w * 0.75, y + h * 0.8);
    ctx.lineTo(x + w * 0.25, y + h * 0.8);
    ctx.lineTo(x, y + h); // Left wing
    ctx.closePath();
    ctx.fill();

    // Central Core cockpit
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + w / 2 - 2, y + 6, 4, 6);
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">👾</span>
            <h2 className="text-lg font-bold text-white tracking-tight">GitHub Space Invaders Activity</h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              NEW
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Arcade-style visualization of commits & contributions via GitHub Actions (<code className="text-emerald-400 font-mono">.github/workflows/space-invaders.yml</code>)
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setViewMode('arcade-game')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'arcade-game'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
              Play Invaders
            </button>
            <button
              onClick={() => setViewMode('gif-preview')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'gif-preview'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              GIF Preview
            </button>
            <button
              onClick={() => setViewMode('snake-classic')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                viewMode === 'snake-classic'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span>🐍</span>
              Snake Mode
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Interactive Playable Space Invaders Arcade Game */}
      {viewMode === 'arcade-game' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Game Stats Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-zinc-950 p-3 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-1.5 font-mono">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-zinc-400">Score:</span>
                <span className="text-white font-bold text-sm">{score}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="text-zinc-400">Hi-Score:</span>
                <span className="text-emerald-400 font-bold text-sm">{highScore}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-zinc-400">Wave:</span>
                <span className="text-cyan-300 font-bold text-sm">{wave}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono">
                <Shield className="w-4 h-4 text-rose-400" />
                <span className="text-zinc-400">Lives:</span>
                <span className="text-rose-400 font-bold text-sm">
                  {'❤️'.repeat(Math.max(0, lives))}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-lg border transition ${
                  soundEnabled
                    ? 'bg-zinc-800 border-zinc-700 text-emerald-400'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
                title={soundEnabled ? 'Mute 8-bit sound' : 'Unmute sound'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setCrtEnabled(!crtEnabled)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition ${
                  crtEnabled
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
                title="Toggle CRT Scanline Effect"
              >
                CRT
              </button>

              <button
                onClick={startNewGame}
                className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Restart
              </button>
            </div>
          </div>

          {/* Arcade Canvas Box */}
          <div className="relative p-2 rounded-xl bg-zinc-950 border border-zinc-800 flex justify-center items-center overflow-hidden">
            <canvas
              ref={canvasRef}
              className="w-full max-w-[600px] h-[360px] sm:h-[400px] object-contain rounded-lg border border-zinc-900 bg-zinc-950 shadow-2xl"
            />

            {/* CRT Scanline Overlay */}
            {crtEnabled && (
              <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 3px, #000 4px)',
                }}
              />
            )}

            {/* Game Over Screen */}
            {gameState === 'gameover' && (
              <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
                <div className="text-3xl font-black text-rose-500 tracking-wider mb-2 font-mono">
                  GAME OVER
                </div>
                <p className="text-xs text-zinc-300 mb-1 font-mono">
                  Final Score: <span className="text-emerald-400 font-bold">{score} pts</span>
                </p>
                <p className="text-xs text-zinc-500 mb-4 font-mono">
                  Survived up to Wave {wave}
                </p>
                <button
                  onClick={startNewGame}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Play Again
                </button>
              </div>
            )}

            {/* Victory / Next Wave Screen */}
            {gameState === 'victory' && (
              <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
                <div className="text-2xl font-black text-emerald-400 tracking-wider mb-2 font-mono">
                  WAVE {wave} CLEARED! 🛸
                </div>
                <p className="text-xs text-zinc-300 mb-4 font-mono">
                  Bonus Score: <span className="text-yellow-400 font-bold">+{wave * 100} pts</span>
                </p>
                <button
                  onClick={nextWave}
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Start Wave {wave + 1}
                </button>
              </div>
            )}
          </div>

          {/* On-screen Controls for Touch & Mobile */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex gap-2">
              <button
                onMouseDown={() => (keysRef.current.left = true)}
                onMouseUp={() => (keysRef.current.left = false)}
                onTouchStart={() => (keysRef.current.left = true)}
                onTouchEnd={() => (keysRef.current.left = false)}
                className="px-4 py-3 bg-zinc-900 active:bg-emerald-600 rounded-xl text-white border border-zinc-800 flex items-center gap-1 text-xs font-mono"
              >
                <ArrowLeft className="w-4 h-4" /> Move Left
              </button>
              <button
                onMouseDown={() => (keysRef.current.right = true)}
                onMouseUp={() => (keysRef.current.right = false)}
                onTouchStart={() => (keysRef.current.right = true)}
                onTouchEnd={() => (keysRef.current.right = false)}
                className="px-4 py-3 bg-zinc-900 active:bg-emerald-600 rounded-xl text-white border border-zinc-800 flex items-center gap-1 text-xs font-mono"
              >
                Move Right <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onMouseDown={() => (keysRef.current.shoot = true)}
              onMouseUp={() => (keysRef.current.shoot = false)}
              onTouchStart={() => (keysRef.current.shoot = true)}
              onTouchEnd={() => (keysRef.current.shoot = false)}
              className="flex-1 max-w-[180px] py-3 bg-emerald-500 active:bg-emerald-400 text-zinc-950 rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
            >
              <Zap className="w-4 h-4" /> Fire Laser
            </button>
          </div>

          <div className="text-[11px] text-zinc-500 text-center font-mono">
            Controles: <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">A</kbd> / <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">D</kbd> o Flechas para moverte. <kbd className="px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-zinc-300">Barra Espaciadora</kbd> para disparar láseres.
          </div>
        </div>
      )}

      {/* Mode 2: Space Shooter GIF Animation Preview */}
      {viewMode === 'gif-preview' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setImgKey((k) => k + 1)}
                className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition flex items-center gap-1.5 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recargar Animación</span>
              </button>
            </div>

            <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              Destino en GitHub: <code className="text-zinc-300">output/space-shooter.gif</code>
            </span>
          </div>

          <div className="relative p-3 sm:p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center min-h-[180px] overflow-hidden">
            <img
              key={imgKey}
              src={PROFILE_INFO.spaceShooterGif}
              alt="Space Shooter GitHub Contribution Activity"
              className="max-w-full h-auto object-contain rounded select-none filter contrast-105"
              onError={(e) => {
                // Fallback rendering from template example
                const target = e.currentTarget;
                target.src = PROFILE_INFO.spaceInvadersFallbackGif;
              }}
            />
          </div>

          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 text-xs text-zinc-400 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-semibold text-zinc-200">Sobre la animación de Space Invaders / Shooter:</span> Utiliza el action <code className="text-emerald-400 font-mono">czl9707/gh-space-shooter@master</code> para transformar los bloques de tu historial de commits en enemigos galácticos y nave atacante con disparos láser.
            </div>
          </div>
        </div>
      )}

      {/* Mode 3: Classic Snake Mode */}
      {viewMode === 'snake-classic' && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-zinc-400 font-mono">
              Modo Clásico de Viborita (Platane/snk)
            </span>
            <button
              onClick={() => setImgKey((k) => k + 1)}
              className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Replay</span>
            </button>
          </div>

          <div className="p-3 sm:p-5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center min-h-[160px]">
            <img
              key={imgKey}
              src={PROFILE_INFO.snakeDarkSvg}
              alt="GitHub Contribution Grid Snake"
              className="max-w-full h-auto object-contain rounded"
              onError={(e) => {
                e.currentTarget.src = 'https://raw.githubusercontent.com/Platane/snk/master/packages/action/example/github-contribution-grid-snake.svg';
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
