'use client';

import React from 'react';
import { GameProvider } from '../context/GameContext';
import { Navbar } from '../components/Navbar';
import { WorldFairHeader } from '../components/WorldFairHeader';
import { NationGrid } from '../components/NationGrid';
import { EliminationAlert } from '../components/EliminationAlert';
import { SettlementModal } from '../components/SettlementModal';
import { ActivityFeed } from '../components/ActivityFeed';
import { DemoControls } from '../components/DemoControls';

export default function Home() {
  return (
    <GameProvider>
      <main className="min-h-screen flex flex-col justify-between selection:bg-amber-500 selection:text-black">
        {/* Top Navigation */}
        <Navbar />

        {/* Demo Fast/Simulation Controls */}
        <DemoControls />

        {/* Active Elimination Banner Overlay */}
        <EliminationAlert />

        {/* Hero Section */}
        <WorldFairHeader />

        {/* 8 Nations Grid */}
        <NationGrid />

        {/* Live Event Stream */}
        <ActivityFeed />

        {/* Settlement Modal Triggered on Winner */}
        <SettlementModal />

        {/* World Fair Footer */}
        <footer className="w-full border-t border-white/5 py-8 mt-12 bg-slate-950/80 text-center text-xs font-mono text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span>🏛️</span>
              <span className="text-slate-300 font-bold">THE LAST PAVILION</span>
              <span>•</span>
              <span className="text-slate-400">CRYPTO'S WORLD FAIR</span>
            </div>
            <div>
              Built for <strong className="text-slate-300">MagicBlock Blitz 9</strong> · Powered by{' '}
              <span className="text-cyan-400 font-semibold">MagicBlock Ephemeral Rollups</span> on{' '}
              <span className="text-amber-400 font-semibold">Solana</span>
            </div>
          </div>
        </footer>
      </main>
    </GameProvider>
  );
}
