import React, { useState } from 'react';
import { Layers, CheckCircle2, Cpu, Wrench, Box, Code } from 'lucide-react';
import { TECH_ITEMS } from '../data/profileData';
import { TechItem } from '../types';

export const TechStack: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeItem, setActiveItem] = useState<TechItem | null>(null);

  const categories = ['All', 'Languages', 'Systems & Hardware', 'DevOps & Tools', 'Engineering & CAD'];

  const filteredItems = selectedCategory === 'All'
    ? TECH_ITEMS
    : TECH_ITEMS.filter((item) => item.category === selectedCategory);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Languages': return <Code className="w-3.5 h-3.5" />;
      case 'Systems & Hardware': return <Cpu className="w-3.5 h-3.5" />;
      case 'DevOps & Tools': return <Wrench className="w-3.5 h-3.5" />;
      case 'Engineering & CAD': return <Box className="w-3.5 h-3.5" />;
      default: return <Layers className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">Technologies & Tools</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Engineering stack spanning programming, hardware interfacing, and CAD/simulation modeling
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-zinc-950/70 p-1 rounded-xl border border-zinc-800/80">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition flex items-center gap-1.5 ${
                selectedCategory === category
                  ? 'bg-emerald-500 text-zinc-950 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              {getCategoryIcon(category)}
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Tech Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredItems.map((item) => {
          const isSelected = activeItem?.id === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveItem(isSelected ? null : item)}
              className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                isSelected
                  ? 'bg-zinc-800/90 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
                  : 'bg-zinc-950/50 hover:bg-zinc-850/80 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center p-2 shrink-0 group-hover:scale-105 transition-transform">
                  <img
                    src={item.iconUrl}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-emerald-400 transition-colors">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/50">
                      {item.category.split(' ')[0]}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {isSelected && (
                <div className="mt-3 pt-2.5 border-t border-zinc-800 text-[11px] text-zinc-300 flex items-center justify-between animate-fadeIn">
                  <span className="text-emerald-400 font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Featured in Profile
                  </span>
                  <span className="text-zinc-500 font-mono">ID: {item.id}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Raw README Badges Visual Bar */}
      <div className="mt-6 pt-5 border-t border-zinc-800/80">
        <div className="text-xs font-mono text-zinc-400 mb-3 flex items-center justify-between">
          <span>Active Badges in README.md:</span>
          <span className="text-zinc-500 text-[11px]">Rendered as in GitHub Profile</span>
        </div>
        <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex flex-wrap items-center justify-center gap-3">
          <img src="https://skillicons.dev/icons?i=py" height="38" alt="python logo" className="h-9 hover:scale-110 transition" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg" height="38" alt="c logo" className="h-9 hover:scale-110 transition" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" height="38" alt="linux logo" className="h-9 hover:scale-110 transition" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" height="38" alt="git logo" className="h-9 hover:scale-110 transition" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" height="38" alt="github logo" className="h-9 hover:scale-110 transition" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg" height="38" alt="raspberrypi logo" className="h-9 hover:scale-110 transition" />
          <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" height="38" alt="vscode logo" className="h-9 hover:scale-110 transition" />
          <img src="https://img.shields.io/badge/Onshape-111827?style=for-the-badge&logo=onshape&logoColor=1D70B8" height="28" alt="onshape logo" className="h-7 hover:scale-105 transition" />
          <img src="https://img.shields.io/badge/SimScale-00283A?style=for-the-badge&logo=simscale&logoColor=00B4D8" height="28" alt="simscale logo" className="h-7 hover:scale-105 transition" />
        </div>
      </div>
    </div>
  );
};
