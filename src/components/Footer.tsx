import React from 'react';
import { GitBranch, Terminal } from 'lucide-react';
import { PROFILE_INFO } from '../data/profileData';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-zinc-400 font-mono">
            {PROFILE_INFO.fullName} • @{PROFILE_INFO.username}
          </span>
        </div>

        <div className="flex items-center gap-4 text-zinc-400">
          <a
            href={PROFILE_INFO.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-white flex items-center gap-1 transition"
          >
            <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
            GitHub
          </a>
          <span>•</span>
          <a
            href={PROFILE_INFO.profileRepoUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition font-mono"
          >
            Repository Source
          </a>
        </div>
      </div>
    </footer>
  );
};

