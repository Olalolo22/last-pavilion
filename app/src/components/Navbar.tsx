'use client';

import React from 'react';
import { useGame } from '../context/GameContext';
import { Zap, Users, Flame, Landmark, ShieldCheck } from 'lucide-react';

export function Navbar() {
  const { round, player } = useGame();

  const influencePercent = (player.influenceRemaining / 100) * 100;

  return (
    <header className="w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-sm sm:text-xl text-white font-['Cinzel'] whitespace-nowrap">
                THE LAST PAVILION
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                BLITZ 9
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
              <span>CRYPTO'S WORLD FAIR</span>
              <span>•</span>
              <span className="text-amber-400/90 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                ROUND #{String(round.roundId).padStart(3, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Center Round Metric Pill */}
        <div className="hidden md:flex items-center gap-6 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono text-slate-300">
          <div className="flex items-center gap-2">
            <Users size={14} className="text-cyan-400" />
            <span>
              <strong className="text-white">{round.totalParticipants}</strong> CITIZENS
            </span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-2">
            <Flame size={14} className="text-amber-400" />
            <span>
              <strong className="text-white">{round.totalActions}</strong> INTERVENTIONS
            </span>
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span className="text-emerald-400 font-semibold">MAGICBLOCK ER</span>
          </div>
        </div>

        {/* Player Influence Metric & Citizen Address */}
        <div className="flex items-center gap-3">
          {/* Influence Box */}
          <div className="flex flex-col items-end px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/20 border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
            <div className="text-[10px] uppercase font-mono tracking-wider text-amber-300/80 font-semibold flex items-center gap-1">
              <Zap size={11} className="text-amber-400 fill-amber-400" />
              YOUR INFLUENCE
            </div>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-xl sm:text-2xl font-black text-amber-300">
                {player.influenceRemaining}
              </span>
              <span className="text-xs text-amber-400/60 font-medium">/ 100</span>
            </div>
            {/* Tiny Progress Bar */}
            <div className="w-20 sm:w-24 h-1 bg-black/40 rounded-full overflow-hidden mt-0.5">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                style={{ width: `${influencePercent}%` }}
              />
            </div>
          </div>

          {/* Citizen Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 hover:border-white/20 transition-all">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs text-slate-300">{player.address}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
