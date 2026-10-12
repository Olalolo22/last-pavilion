'use client';

import React, { useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { X, RotateCcw } from 'lucide-react';
import { playChirp } from '../lib/audio';

export function EliminationAlert() {
  const {
    lastEliminatedNation,
    dismissEliminationAlert,
    round,
    player,
    claimRefund,
  } = useGame();

  useEffect(() => {
    if (!lastEliminatedNation) return;
    const timer = setTimeout(() => {
      dismissEliminationAlert();
    }, 6000);
    return () => clearTimeout(timer);
  }, [lastEliminatedNation, dismissEliminationAlert]);

  if (!lastEliminatedNation) return null;

  const hasClaimed = player.refundsClaimed[lastEliminatedNation.id];

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-lg animate-in fade-in slide-in-from-top-4 duration-300">
      <div
        className="p-4 sm:p-5 flex items-center justify-between gap-4"
        style={{
          background: '#1a1916',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderLeft: '4px solid #f43f5e',
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.8)',
          color: 'var(--paper)',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '30px' }}>{lastEliminatedNation.emoji}</span>
          <div>
            <div
              style={{
                color: '#f43f5e',
                font: "500 10px 'DM Mono', monospace",
                letterSpacing: '.14em',
                textTransform: 'uppercase',
              }}
            >
              PAVILION EXTINCT · REFUND POOL ACTIVE
            </div>
            <h4
              style={{
                fontSize: '17px',
                fontWeight: 700,
                letterSpacing: '-.02em',
                margin: '2px 0 3px',
                color: 'var(--paper)',
              }}
            >
              {lastEliminatedNation.name} has fallen!
            </h4>
            <p
              style={{
                color: '#817d73',
                font: "10px 'DM Mono', monospace",
                letterSpacing: '.08em',
              }}
            >
              Drain accelerated to{' '}
              <strong style={{ color: 'var(--paper)' }}>
                −{round.currentDrainRate}/sec
              </strong>
              .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!hasClaimed && (
            <button
              onClick={() => {
                playChirp(780, 0.16, 0.12);
                claimRefund(lastEliminatedNation.id);
                dismissEliminationAlert();
              }}
              className="support-button"
              style={{
                padding: '8px 12px',
                borderColor: 'var(--brass)',
                color: 'var(--paper)',
                background: 'rgba(177,138,74,0.18)',
                whiteSpace: 'nowrap',
                fontSize: '10px',
              }}
            >
              <RotateCcw size={11} className="inline mr-1" /> CLAIM REFUND
            </button>
          )}

          <button
            onClick={dismissEliminationAlert}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#817d73',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
