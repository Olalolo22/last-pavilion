'use client';

import React from 'react';
import Link from 'next/link';
import { GameProvider } from '../../context/GameContext';
import { NationGrid } from '../../components/NationGrid';
import { EliminationAlert } from '../../components/EliminationAlert';
import { SettlementModal } from '../../components/SettlementModal';
import { DemoControls } from '../../components/DemoControls';

export default function FairPage() {
  return (
    <GameProvider>
      <main className="game-shell">
        <header className="game-nav">
          <Link href="/" className="hover:text-amber-300 transition-colors" style={{ textDecoration: 'none', color: 'inherit' }}>
            <strong>THE LAST PAVILION</strong>
          </Link>
          <span>ROUND 42 · LIVE WORLD</span>
        </header>

        <EliminationAlert />
        <NationGrid />
        <SettlementModal />
        <DemoControls />
      </main>
    </GameProvider>
  );
}
