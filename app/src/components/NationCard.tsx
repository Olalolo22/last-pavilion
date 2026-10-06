'use client';

import React from 'react';
import { Clock, Zap } from 'lucide-react';
import { Nation } from '../lib/types';
import { useGame } from '../context/GameContext';
import { METER_CAPACITY } from '../lib/constants';

export function NationCard({ nation }: { nation: Nation }) {
  const { round, player, cooldownRemaining, supportNation, selectNation, isFastMode } = useGame();
  const eliminated = nation.isEliminated;
  const critical = !eliminated && nation.meter <= 250;
  const selected = player.selectedNationId === nation.id;
  const percent = Math.max(0, Math.min(100, nation.meter / METER_CAPACITY * 100));
  const drain = round.currentDrainRate * (isFastMode ? 3 : 1);
  const seconds = drain ? Math.ceil(nation.meter / drain) : 0;
  const time = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const disabled = eliminated || round.status !== 'ACTIVE' || player.influenceRemaining < 10 || cooldownRemaining > 0;

  return (
    <article className={`pavilion ${selected && !eliminated ? 'is-selected' : ''} ${critical ? 'is-critical' : ''} ${eliminated ? 'is-fallen' : ''}`} style={{ '--nation-color': nation.color } as React.CSSProperties} onClick={() => selectNation(nation.id)}>
      <div className="pavilion-top"><span className="pavilion-icon">{nation.emoji}</span><span className="pavilion-status">{eliminated ? 'FALLEN' : critical ? 'CRITICAL' : 'ALIVE'}</span></div>
      <h2>{nation.name}</h2>
      <div className="meter-line"><span style={{ width: `${percent}%` }} /></div>
      <div className="pavilion-meta"><span>{eliminated ? 'EXTINCT' : <><Clock aria-hidden="true" /> {time}</>}</span><strong>{Math.round(percent)}%</strong></div>
      <button className="support-button" disabled={disabled} onClick={(event) => { event.stopPropagation(); supportNation(nation.id); }}>
        <Zap aria-hidden="true" /> {eliminated ? 'PAVILION LOST' : cooldownRemaining > 0 ? 'COOLDOWN' : player.influenceRemaining < 10 ? 'NO INFLUENCE' : 'SUPPORT'}
      </button>
    </article>
  );
}
