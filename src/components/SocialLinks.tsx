import React from 'react';
import { Send, Music, Camera, ExternalLink, Share2 } from 'lucide-react';
import { SOCIAL_LINKS } from '../data/profileData';

export const SocialLinks: React.FC = () => {
  const getSocialIcon = (id: string) => {
    switch (id) {
      case 'instagram':
        return <Camera className="w-5 h-5 text-pink-400" />;
      case 'spotify':
        return <Music className="w-5 h-5 text-emerald-400" />;
      case 'telegram':
        return <Send className="w-5 h-5 text-sky-400" />;
      default:
        return <Share2 className="w-5 h-5 text-zinc-400" />;
    }
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white tracking-tight">Connect & Social Media</h3>
        </div>
        <span className="text-xs text-zinc-400">Direct Contact Channels</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="p-4 rounded-xl bg-zinc-950/70 hover:bg-zinc-850 border border-zinc-800/80 hover:border-zinc-700 transition flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-105 transition">
                  {getSocialIcon(link.id)}
                </div>
                <img src={link.badgeImg} alt={link.name} className="h-5 object-contain" />
              </div>

              <div className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition">
                {link.name}
              </div>
              <div className="text-xs font-mono text-zinc-400 mt-0.5">{link.username}</div>

              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                {link.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400 group-hover:text-zinc-200 transition">
              <span>Open Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
