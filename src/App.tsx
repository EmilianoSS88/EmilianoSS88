import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TechStack } from './components/TechStack';
import { SnakeContributionViewer } from './components/SnakeContributionViewer';
import { StatsDashboard } from './components/StatsDashboard';
import { SocialLinks } from './components/SocialLinks';
import { WorkflowInspector } from './components/WorkflowInspector';
import { ReadmeViewer } from './components/ReadmeViewer';
import { Footer } from './components/Footer';
import { GitHubUserData, GitHubRepo } from './types';
import { PROFILE_INFO } from './data/profileData';

export function App() {
  const [userData, setUserData] = useState<GitHubUserData | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        setLoading(true);
        // Fetch User profile
        const userRes = await fetch(`https://api.github.com/users/${PROFILE_INFO.username}`);
        if (userRes.ok) {
          const uData = await userRes.json();
          setUserData(uData);
        }

        // Fetch Repositories
        const reposRes = await fetch(`https://api.github.com/users/${PROFILE_INFO.username}/repos?sort=updated&per_page=6`);
        if (reposRes.ok) {
          const rData = await reposRes.json();
          setRepos(rData);
        }
      } catch (err) {
        console.warn('GitHub API fetch failed or rate limited:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Banner Header */}
      <Header userData={userData} loading={loading} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Snake Grid & Animation (Core Feature of the Repo) */}
        <section id="snake-section">
          <SnakeContributionViewer />
        </section>

        {/* Tech Stack & Engineering Toolkit */}
        <section id="tech-stack-section">
          <TechStack />
        </section>

        {/* Real-time GitHub Stats & Visualizations */}
        <section id="stats-section">
          <StatsDashboard repos={repos} loadingRepos={loading} />
        </section>

        {/* Social Links & Connections */}
        <section id="social-section">
          <SocialLinks />
        </section>

        {/* Workflow & README Breakdown */}
        <section id="workflow-readme-section" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WorkflowInspector />
          <ReadmeViewer />
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
