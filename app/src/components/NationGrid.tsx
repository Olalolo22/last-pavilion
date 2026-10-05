'use client';

import React from 'react';
import { useGame } from '../context/GameContext';
import { NationCard } from './NationCard';

export function NationGrid() {
  const { round } = useGame();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-bold font-['Cinzel'] tracking-wide text-white uppercase flex items-center gap-2">
          <span>THE EIGHT COMPETING PAVILIONS</span>
          <span className="text-xs font-mono font-normal text-slate-400">
            (Select and intervene)
          </span>
        </h2>
        <span className="text-xs font-mono text-amber-400/80">
          Costs 10 Influence per click
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {round.nations.map((nation) => (
          <NationCard key={nation.id} nation={nation} />
        ))}
      </div>
    </div>
  );
}
