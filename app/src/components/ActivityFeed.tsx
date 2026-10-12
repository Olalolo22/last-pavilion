'use client';

import React from 'react';
import { useGame } from '../context/GameContext';
import { Radio } from 'lucide-react';

export function ActivityFeed() {
  const { activityFeed } = useGame();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div
        className="p-4"
        style={{
          background: '#1a1916',
          border: '1px solid var(--line)',
          fontFamily: "'DM Mono', monospace",
        }}
      >
        <div
          className="flex items-center justify-between mb-3 pb-2.5"
          style={{ borderBottom: '1px solid var(--line)' }}
        >
          <div
            className="flex items-center gap-2 text-xs uppercase"
            style={{ color: 'var(--paper)', letterSpacing: '.14em' }}
          >
            <Radio size={13} style={{ color: '#9cbd73' }} className="animate-pulse" />
            <span>LIVE TELEMETRY STREAM</span>
          </div>
          <span style={{ fontSize: '10px', color: '#817d73', letterSpacing: '.1em' }}>
            SUB-SECOND SVM EVENT LOG
          </span>
        </div>

        <div className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
          {activityFeed.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between py-1.5 px-3 text-xs transition-colors"
              style={{
                background: '#24221d',
                border: '1px solid var(--line)',
              }}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-sm">{event.emoji || '⚡'}</span>
                <span style={{ color: '#817d73' }} className="truncate">
                  {event.player}:
                </span>
                <span
                  style={{
                    color:
                      event.type === 'ELIMINATION'
                        ? '#f43f5e'
                        : event.type === 'REFUND'
                        ? 'var(--brass)'
                        : event.type === 'SETTLEMENT'
                        ? '#9cbd73'
                        : 'var(--paper)',
                    fontWeight: event.type === 'ELIMINATION' || event.type === 'SETTLEMENT' ? 700 : 400,
                  }}
                >
                  {event.message}
                </span>
              </div>
              <span
                style={{
                  fontSize: '10px',
                  color: '#817d73',
                  marginLeft: '12px',
                  flexShrink: 0,
                }}
              >
                {Math.max(1, Math.floor((Date.now() - event.timestamp) / 1000))}s ago
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
