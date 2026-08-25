import React, { useState } from 'react';
import { BookOpen, Copy, Check, Code2 } from 'lucide-react';

export const ReadmeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw'>('preview');

  const rawMarkdown = `<h1 data-importer="text" align="center">Emiliano Serrano Sánchez</h1>

<p data-importer="text" align="center">Engineering solutions line by line, commit by commit 🏙️</p>

###

<!-- Tecnologías y Herramientas -->
<div data-importer="techs" align="center">
  <img src="https://skillicons.dev/icons?i=py" height="50" alt="python logo" />
  <img width="8" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" height="50" alt="c logo" />
  <img width="8" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" height="50" alt="linux logo" />
  <img width="8" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" height="50" alt="git logo" />
  <img width="8" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" height="50" alt="github logo" />
  <img width="8" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg" height="50" alt="raspberrypi logo" />
  <img width="8" />
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" height="50" alt="vscode logo" />
  <img width="8" />
  <img src="https://img.shields.io/badge/Onshape-111827?style=for-the-badge&logo=onshape&logoColor=1D70B8" height="35" alt="onshape logo" />
  <img width="8" />
  <img src="https://img.shields.io/badge/SimScale-00283A?style=for-the-badge&logo=simscale&logoColor=00B4D8" height="35" alt="simscale logo" />
</div>

###

<!-- Redes Sociales -->
<div data-importer="socials" align="center">
  <a href="https://www.instagram.com/_emiliano_ss/" target="_blank">
    <img src="https://img.shields.io/static/v1?message=Instagram&logo=instagram&label=&color=E4405F&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="instagram logo" />
  </a>
  <a href="https://open.spotify.com/user/31li7diiteo3sdsrbllmvggdmqby?si=b2b300c9d7dc400c" target="_blank">
    <img src="https://img.shields.io/static/v1?message=Spotify&logo=spotify&label=&color=000000&logoColor=1DB954&labelColor=&style=for-the-badge" height="25" alt="spotify logo" />
  </a>
  <a href="https://t.me/EmilianoSS88" target="_blank">
    <img src="https://img.shields.io/static/v1?message=Telegram&logo=telegram&label=&color=2CA5E0&logoColor=white&labelColor=&style=for-the-badge" height="25" alt="telegram logo" />
  </a>
</div>

###

<!-- Nuevas Estadísticas Profesionales -->
<div align="center">
  <!-- Tarjeta de Racha de Commits -->
  <img src="https://github-readme-streak-stats.herokuapp.com/?user=EmilianoSS88&theme=dracula&hide_border=false" height="170" alt="Racha de Commits" />
</div>

###

<div align="center">
  <!-- Gráfica de Actividad de los últimos 31 días -->
  <img src="https://github-readme-activity-graph.vercel.app/graph?username=EmilianoSS88&bg_color=282a36&color=f8f8f2&line=ff79c6&point=bd93f9&area=true&hide_border=false" width="100%" alt="Gráfica de Actividad" />
</div>

###

<!-- Animación Arcade Space Invaders / Contribuciones -->
<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/EmilianoSS88/EmilianoSS88/output/space-shooter.gif">
    <img alt="github contribution space invaders animation" src="https://raw.githubusercontent.com/EmilianoSS88/EmilianoSS88/output/space-shooter.gif" width="100%">
  </picture>
</div>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(rawMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white tracking-tight">README.md Specification</h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setViewMode('preview')}
              className={`px-3 py-1 rounded-lg transition ${
                viewMode === 'preview' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Profile View
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`px-3 py-1 rounded-lg transition ${
                viewMode === 'raw' ? 'bg-zinc-800 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Raw Markdown
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {viewMode === 'preview' ? (
        <div className="p-6 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-col items-center gap-6 text-center">
          <div>
            <h1 className="text-2xl font-black text-white">Emiliano Serrano Sánchez</h1>
            <p className="text-sm text-zinc-300 mt-1">Engineering solutions line by line, commit by commit 🏙️</p>
          </div>

          {/* Techs */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <img src="https://skillicons.dev/icons?i=py" height="42" alt="python logo" className="h-10" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" height="42" alt="c logo" className="h-10" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" height="42" alt="linux logo" className="h-10" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" height="42" alt="git logo" className="h-10" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" height="42" alt="github logo" className="h-10" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg" height="42" alt="raspberrypi logo" className="h-10" />
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" height="42" alt="vscode logo" className="h-10" />
            <img src="https://img.shields.io/badge/Onshape-111827?style=for-the-badge&logo=onshape&logoColor=1D70B8" height="30" alt="onshape logo" className="h-7" />
            <img src="https://img.shields.io/badge/SimScale-00283A?style=for-the-badge&logo=simscale&logoColor=00B4D8" height="30" alt="simscale logo" className="h-7" />
          </div>

          {/* Socials */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a href="https://www.instagram.com/_emiliano_ss/" target="_blank" rel="noreferrer">
              <img src="https://img.shields.io/static/v1?message=Instagram&logo=instagram&label=&color=E4405F&logoColor=white&labelColor=&style=for-the-badge" height="24" alt="instagram logo" className="h-6" />
            </a>
            <a href="https://open.spotify.com/user/31li7diiteo3sdsrbllmvggdmqby?si=b2b300c9d7dc400c" target="_blank" rel="noreferrer">
              <img src="https://img.shields.io/static/v1?message=Spotify&logo=spotify&label=&color=000000&logoColor=1DB954&labelColor=&style=for-the-badge" height="24" alt="spotify logo" className="h-6" />
            </a>
            <a href="https://t.me/EmilianoSS88" target="_blank" rel="noreferrer">
              <img src="https://img.shields.io/static/v1?message=Telegram&logo=telegram&label=&color=2CA5E0&logoColor=white&labelColor=&style=for-the-badge" height="24" alt="telegram logo" className="h-6" />
            </a>
          </div>

          {/* Stats Image */}
          <div className="w-full flex justify-center">
            <img src="https://github-readme-streak-stats.herokuapp.com/?user=EmilianoSS88&theme=dracula&hide_border=false" alt="Racha de Commits" className="max-w-full h-auto rounded" />
          </div>

          {/* Activity Graph */}
          <div className="w-full flex justify-center">
            <img src="https://github-readme-activity-graph.vercel.app/graph?username=EmilianoSS88&bg_color=282a36&color=f8f8f2&line=ff79c6&point=bd93f9&area=true&hide_border=false" alt="Gráfica de Actividad" className="w-full h-auto rounded" />
          </div>

          {/* Space Invaders / Shooter Animation */}
          <div className="w-full flex justify-center">
            <img
              src="https://raw.githubusercontent.com/EmilianoSS88/EmilianoSS88/output/space-shooter.gif"
              alt="github contribution space invaders"
              className="max-w-full h-auto rounded"
              onError={(e) => {
                e.currentTarget.src = 'https://raw.githubusercontent.com/czl9707/gh-space-shooter/master/assets/output.gif';
              }}
            />
          </div>
        </div>
      ) : (
        <pre className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed max-h-96">
          <code>{rawMarkdown}</code>
        </pre>
      )}
    </div>
  );
};
