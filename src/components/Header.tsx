import React from 'react';
import { ExternalLink, Sparkles, Terminal, Code2, MapPin, Activity, GitBranch } from 'lucide-react';
import { PROFILE_INFO, SOCIAL_LINKS } from '../data/profileData';
import { GitHubUserData } from '../types';

interface HeaderProps {
  userData: GitHubUserData | null;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({ userData, loading }) => {
  return (
    <header className="relative border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md">
      {/* Subtle glowing ambient accent */}
      <div className="absolute top-0 left-1/4 w-96 h-28 bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-28 bg-cyan-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          {/* Avatar and Main Bio */}
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-xl shadow-emerald-500/10">
                <img
                  src={userData?.avatar_url || `https://github.com/${PROFILE_INFO.username}.png`}
                  alt={PROFILE_INFO.fullName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-xl object-cover bg-zinc-900"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-zinc-950 p-1 rounded-full border-2 border-zinc-950" title="Active on GitHub">
                <Activity className="w-3.5 h-3.5 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
                  {PROFILE_INFO.fullName}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <Terminal className="w-3 h-3" /> @{PROFILE_INFO.username}
                </span>
              </div>

              <p className="mt-1.5 text-sm sm:text-base text-zinc-300 flex items-center gap-2 font-medium">
                {PROFILE_INFO.tagline}
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  {userData?.location || PROFILE_INFO.location}
                </span>
                <span className="flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-zinc-500" />
                  Python & C Developer • CAE / CAD
                </span>
                {userData && (
                  <span className="flex items-center gap-1 font-mono text-zinc-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    {userData.public_repos} Public Repos
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action links */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <a
              href={PROFILE_INFO.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold border border-zinc-700/80 transition shadow-sm hover:border-zinc-500"
            >
              <GitBranch className="w-4 h-4 text-emerald-400" />
              <span>GitHub Profile</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  title={social.name}
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 transition flex items-center justify-center gap-1.5"
                >
                  <img src={social.badgeImg} alt={social.name} className="h-4 object-contain rounded" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
