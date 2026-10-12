'use client';

import React from 'react';
import { useGame } from '../context/GameContext';
import { Activity, Radio } from 'lucide-react';

export function ActivityFeed() {
  const { activityFeed } = useGame();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="glass-panel p-4 border border-white/10">
        <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
            <Radio size={14} className="text-emerald-400 animate-pulse" />
            <span>LIVE WORLD'S FAIR TELEMETRY</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            SUB-SECOND EPHEMERAL ROLLUP STREAM
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
          {activityFeed.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-white/[0.02] border border-white/5 text-xs font-mono hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-sm">{event.emoji || '⚡'}</span>
                <span className="text-slate-400 font-semibold truncate">
                  {event.player}:
                </span>
                <span
                  className={
                    event.type === 'ELIMINATION'
                      ? 'text-red-400 font-bold'
                      : event.type === 'REFUND'
                      ? 'text-purple-300 font-semibold'
                      : event.type === 'SETTLEMENT'
                      ? 'text-amber-300 font-bold'
                      : 'text-slate-200'
                  }
                >
                  {event.message}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 flex-shrink-0 ml-3">
                {Math.max(1, Math.floor((Date.now() - event.timestamp) / 1000))}s ago
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
