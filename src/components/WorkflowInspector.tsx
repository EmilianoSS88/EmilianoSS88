import React, { useState } from 'react';
import { Terminal, Copy, Check, FileCode2, PlayCircle, GitCommit, GitBranch, Sparkles } from 'lucide-react';

export const WorkflowInspector: React.FC = () => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<'space-invaders' | 'snake'>('space-invaders');
  const [copied, setCopied] = useState(false);

  const spaceInvadersYaml = `name: Generate Space Invaders Activity Animation

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
  push:
    branches:
      - main
      - master

permissions:
  contents: write

jobs:
  build:
    runs-on: ubuntu-latest
    name: generate-space-shooter-animation
    timeout-minutes: 10
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 2

      - name: Generate Space Shooter Contribution Animation
        uses: czl9707/gh-space-shooter@master
        with:
          github-token: \${{ secrets.GITHUB_TOKEN }}
          output-path: ./dist/space-shooter.gif
          strategy: column # column, row, or random
          fps: 20

      - name: Push to output branch
        uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`;

  const snakeYaml = `name: Generate Snake Animation

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
  push:
    branches:
      - main
      - master

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    timeout-minutes: 5
    
    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Generate GitHub Snake
        uses: Platane/snk/svg-only@v3
        with:
          github_user_name: \${{ github.repository_owner }}
          outputs: |
            dist/github-contribution-grid-snake.svg
            dist/github-contribution-grid-snake-dark.svg?palette=github-dark
          
      - name: Push to output branch
        uses: crazy-max/ghaction-github-pages@v3.1.0
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`;

  const currentYaml = selectedWorkflow === 'space-invaders' ? spaceInvadersYaml : snakeYaml;
  const currentFileName = selectedWorkflow === 'space-invaders' ? '.github/workflows/space-invaders.yml' : '.github/workflows/snake.yml';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">GitHub Actions Workflow</h3>
            <span className="text-xs font-mono text-zinc-400">{currentFileName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tabs */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setSelectedWorkflow('space-invaders')}
              className={`px-3 py-1 font-semibold rounded-lg transition ${
                selectedWorkflow === 'space-invaders'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              👾 Space Invaders
            </button>
            <button
              onClick={() => setSelectedWorkflow('snake')}
              className={`px-3 py-1 font-semibold rounded-lg transition ${
                selectedWorkflow === 'snake'
                  ? 'bg-emerald-500 text-zinc-950 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🐍 Snake
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied YAML' : 'Copy Workflow'}
          </button>
        </div>
      </div>

      {/* Workflow Step Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/60 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
            <PlayCircle className="w-3.5 h-3.5" /> 1. Scheduled Trigger
          </div>
          <p className="text-zinc-400">
            Fires daily at midnight UTC (<code className="font-mono text-zinc-300">0 0 * * *</code>) and manually via <code className="font-mono text-zinc-300">workflow_dispatch</code>.
          </p>
        </div>

        <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/60 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
            <GitCommit className="w-3.5 h-3.5" /> 2. {selectedWorkflow === 'space-invaders' ? 'Space Shooter Action' : 'Snake Action'}
          </div>
          <p className="text-zinc-400">
            {selectedWorkflow === 'space-invaders'
              ? 'Transforms contribution commits into animated arcade enemies with lasers.'
              : 'Renders light & dark SVG animations of the snake eating commit squares.'}
          </p>
        </div>

        <div className="p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/60 text-xs">
          <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1">
            <GitBranch className="w-3.5 h-3.5" /> 3. Branch Push
          </div>
          <p className="text-zinc-400">
            Commits generated animation to the orphan <code className="font-mono text-zinc-300">output</code> branch automatically.
          </p>
        </div>
      </div>

      {/* Code Box */}
      <div className="relative rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-zinc-800 text-[11px] font-mono text-zinc-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>YAML Workflow Definition ({currentFileName})</span>
          </div>
          <span className="text-zinc-500">Ubuntu Latest</span>
        </div>
        <pre className="p-4 text-xs font-mono text-emerald-300/90 overflow-x-auto leading-relaxed max-h-72">
          <code>{currentYaml}</code>
        </pre>
      </div>
    </div>
  );
};
