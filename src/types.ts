export interface TechItem {
  id: string;
  name: string;
  category: 'Languages' | 'Systems & Hardware' | 'DevOps & Tools' | 'Engineering & CAD';
  iconUrl: string;
  badgeUrl?: string;
  description: string;
  color: string;
}

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  color: string;
  badgeImg: string;
  username: string;
  description: string;
}

export interface GitHubUserData {
  login: string;
  name: string;
  avatar_url: string;
  bio: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  html_url: string;
  location?: string;
  blog?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}
