'use client';

import React from 'react';
import { Clock, Zap, RotateCcw } from 'lucide-react';
import { Nation } from '../lib/types';
import { useGame } from '../context/GameContext';
import { METER_CAPACITY, DEATH_REFUND_POOL } from '../lib/constants';

export function NationCard({ nation }: { nation: Nation }) {
  const {
    round,
    player,
    cooldownRemaining,
    supportNation,
    claimRefund,
    selectNation,
    isFastMode,
  } = useGame();

  const eliminated = nation.isEliminated;
  const critical = !eliminated && nation.meter <= 250;
  const selected = player.selectedNationId === nation.id;
  const percent = Math.max(0, Math.min(100, (nation.meter / METER_CAPACITY) * 100));

  const drain = round.currentDrainRate * (isFastMode ? 3 : 1);
  const seconds = drain ? Math.ceil(nation.meter / drain) : 0;
  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(
    seconds % 60
  ).padStart(2, '0')}`;

  const playerSpentOnThis = player.influenceSpentPerNation[nation.id];
  const hasClaimedRefund = player.refundsClaimed[nation.id];
  const canClaimRefund = eliminated && playerSpentOnThis > 0 && !hasClaimedRefund;

  const potentialRefund = Math.min(
    DEATH_REFUND_POOL,
    Math.max(
      1,
      Math.round(
        (playerSpentOnThis * DEATH_REFUND_POOL) /
          Math.max(1, nation.totalInfluenceSpent)
      )
    )
  );

  const disabled =
    eliminated ||
    round.status !== 'ACTIVE' ||
    player.influenceRemaining < 10 ||
    cooldownRemaining > 0;

  const handleSupport = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (eliminated) return;
    supportNation(nation.id);
  };

  const handleClaimRefund = (e: React.MouseEvent) => {
    e.stopPropagation();
    claimRefund(nation.id);
  };

  return (
    <article
      className={`pavilion ${selected && !eliminated ? 'is-selected' : ''} ${
        critical ? 'is-critical' : ''
      } ${eliminated ? 'is-fallen' : ''}`}
      style={{ '--nation-color': nation.color } as React.CSSProperties}
      onClick={() => selectNation(nation.id)}
    >
      <div className="pavilion-top">
        <span className="pavilion-icon">{nation.emoji}</span>
        <span className="pavilion-status">
          {eliminated ? 'FALLEN' : critical ? 'CRITICAL' : 'ALIVE'}
        </span>
      </div>

      <h2>{nation.name}</h2>

      <div className="meter-line">
        <span style={{ width: `${percent}%` }} />
      </div>

      <div className="pavilion-meta">
        <span>
          {eliminated ? (
            'EXTINCT'
          ) : (
            <>
              <Clock size={11} aria-hidden="true" /> {time}
            </>
          )}
        </span>
        <strong>{Math.round(percent)}%</strong>
      </div>

      {/* Action: SUPPORT or CLAIM REFUND */}
      {eliminated ? (
        canClaimRefund ? (
          <button
            className="support-button"
            style={{
              borderColor: '#a855f7',
              color: '#d8b4fe',
              background: 'rgba(168,85,247,0.15)',
            }}
            onClick={handleClaimRefund}
          >
            <RotateCcw size={12} aria-hidden="true" /> CLAIM +{potentialRefund} REFUND
          </button>
        ) : (
          <button className="support-button" disabled>
            {hasClaimedRefund ? 'REFUND CREDITED' : 'PAVILION LOST'}
          </button>
        )
      ) : (
        <button
          className="support-button"
          disabled={disabled}
          onClick={handleSupport}
        >
          <Zap size={12} aria-hidden="true" />{' '}
          {cooldownRemaining > 0
            ? 'COOLDOWN'
            : player.influenceRemaining < 10
            ? 'NO INFLUENCE'
            : 'SUPPORT (+50)'}
        </button>
      )}
    </article>
  );
}
