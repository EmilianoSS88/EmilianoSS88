import React from 'react';
import { BarChart3, TrendingUp, GitFork, Star, FolderGit2, Calendar, ExternalLink } from 'lucide-react';
import { PROFILE_INFO } from '../data/profileData';
import { GitHubRepo } from '../types';

interface StatsDashboardProps {
  repos: GitHubRepo[];
  loadingRepos: boolean;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ repos, loadingRepos }) => {
  return (
    <div className="space-y-6">
      {/* Activity Graph and Streak Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Streak Stats Card */}
        <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white tracking-tight">Commit Streak Stats</h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-indigo-400 border border-zinc-800">
                Dracula Theme
              </span>
            </div>

            <div className="bg-zinc-950 rounded-xl p-2 sm:p-3 border border-zinc-800/80 flex items-center justify-center overflow-hidden">
              <img
                src={PROFILE_INFO.streakStatsUrl}
                alt="EmilianoSS88 Streak Stats"
                className="w-full h-auto object-contain rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/60 text-xs text-zinc-400 flex items-center justify-between">
            <span>Powered by streak-stats API</span>
            <a
              href={`https://github.com/${PROFILE_INFO.username}`}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:underline flex items-center gap-1"
            >
              Verify Profile <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* 31-Day Activity Graph Card */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white tracking-tight">31-Day Activity Graph</h3>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                Rolling Window
              </span>
            </div>

            <div className="bg-zinc-950 rounded-xl p-2 border border-zinc-800/80 overflow-x-auto flex items-center justify-center min-h-[160px]">
              <img
                src={PROFILE_INFO.activityGraphUrl}
                alt="EmilianoSS88 31-day activity graph"
                className="w-full h-auto object-contain rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/60 text-xs text-zinc-400 flex items-center justify-between">
            <span>Updated with daily commit timeline</span>
            <span className="font-mono text-zinc-500 text-[11px]">user: EmilianoSS88</span>
          </div>
        </div>
      </div>

      {/* Featured Repositories Section */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Public Repositories & Work</h3>
          </div>
          <a
            href={`https://github.com/${PROFILE_INFO.username}?tab=repositories`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition"
          >
            View all on GitHub <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {loadingRepos ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-28 bg-zinc-950/60 rounded-xl animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : repos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-zinc-950/60 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-emerald-400 transition font-mono truncate">
                      {repo.name}
                    </h4>
                    <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-300 shrink-0 transition" />
                  </div>
                  <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {repo.description || 'Public engineering repository and codebase.'}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                  <div className="flex items-center gap-3">
                    {repo.language && (
                      <span className="flex items-center gap-1 text-zinc-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-zinc-500" /> {repo.stargazers_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <GitFork className="w-3 h-3 text-zinc-500" /> {repo.forks_count}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-zinc-600">
                    <Calendar className="w-3 h-3" />
                    {new Date(repo.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-zinc-400 font-mono">
            Directly exploring repository: <span className="text-emerald-400">EmilianoSS88/EmilianoSS88</span>
          </div>
        )}
      </div>
    </div>
  );
};
