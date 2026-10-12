'use client';

import React from 'react';
import Link from 'next/link';
import { INITIAL_NATIONS } from '../lib/nations';

export default function LandingPage() {
  return (
    <main className="landing-shell">
      {/* Background Animated Beacons of 8 Competing Nations */}
      <div className="landing-grid" aria-hidden="true">
        {INITIAL_NATIONS.map((nation, index) => (
          <div
            key={nation.id}
            className="landing-beacon"
            style={
              {
                '--nation-color': nation.color,
                '--delay': `${index * 0.45}s`,
              } as React.CSSProperties
            }
          >
            <span>
              {nation.emoji}
            </span>
            <i />
          </div>
        ))}
      </div>

      <header className="landing-nav">
        <span className="brand-mark">THE LAST PAVILION</span>
        <span className="nav-note">CRYPTO&apos;S WORLD FAIR / ROUND 42</span>
      </header>

      <section className="landing-hero">
        <p className="eyebrow">A LIVE SURVIVAL ATTRACTION</p>
        <h1>
          Eight nations enter.
          <br />
          <em>One survives.</em>
        </h1>
        <p className="landing-copy">
          A multiplayer survival attraction where everyone decides which ideals survive
          Crypto&apos;s World Fair.
        </p>
        <Link className="enter-button" href="/fair">
          ENTER THE FAIR <span aria-hidden="true">→</span>
        </Link>
        <p className="landing-footnote">
          Built on Solana <span>·</span> Powered by MagicBlock
        </p>
      </section>

      <div className="landing-story" aria-label="How the attraction works">
        <span>
          <b>01</b> Choose a nation
        </span>
        <span>
          <b>02</b> Spend Influence
        </span>
        <span>
          <b>03</b> Keep it alive
        </span>
      </div>
    </main>
  );
}
