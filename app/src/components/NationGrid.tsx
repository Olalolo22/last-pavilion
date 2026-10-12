'use client';

import React from 'react';
import { useGame } from '../context/GameContext';
import { NationCard } from './NationCard';
import { playChirp } from '../lib/audio';

export function NationGrid() {
  const { round, player, grantStipend } = useGame();

  return (
    <section className="game-stage" aria-label="The eight competing nations">
      <div className="stage-heading">
        <div>
          <p className="eyebrow">THE LAST PAVILION</p>
          <h1>
            Eight nations. <em>One survives.</em>
          </h1>
        </div>
        <div className="influence">
          <span>YOUR INFLUENCE</span>
          <strong>{player.influenceRemaining}</strong>
          <i>
            <b
              style={{
                width: `${Math.min(100, player.influenceRemaining)}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </i>
          {player.influenceRemaining < 20 && (
            <button
              onClick={() => {
                playChirp(880, 0.14, 0.1);
                grantStipend(50);
              }}
              style={{
                marginTop: '8px',
                background: 'rgba(177, 138, 74, 0.15)',
                border: '1px solid var(--brass)',
                color: 'var(--paper)',
                padding: '4px 10px',
                fontSize: '10px',
                fontFamily: "'DM Mono', monospace",
                letterSpacing: '.1em',
                cursor: 'pointer',
                transition: '.2s',
              }}
            >
              +50 CITIZEN STIPEND
            </button>
          )}
        </div>
      </div>

      <div className="alive-count">
        <span className="live-dot" /> {round.aliveNationsCount} PAVILIONS ALIVE{' '}
        <span>·</span>{' '}
        {round.nations.some((n) => n.isEliminated && !player.refundsClaimed[n.id]) ? (
          <span style={{ color: 'var(--brass)' }}>DEATH REFUND POOL ACTIVE</span>
        ) : (
          'CHOOSE ONE TO SUPPORT'
        )}
      </div>

      <div className="nation-grid">
        {round.nations.map((nation) => (
          <NationCard key={nation.id} nation={nation} />
        ))}
      </div>
    </section>
  );
}
