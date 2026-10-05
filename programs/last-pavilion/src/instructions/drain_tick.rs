use anchor_lang::prelude::*;
use crate::state::{RoundState, RoundStatus, ACCELERATION_PER_DEATH};
use crate::errors::PavilionError;

#[derive(Accounts)]
#[instruction(round_id: u64)]
pub struct DrainTick<'info> {
    #[account(
        mut,
        seeds = [b"round", round_id.to_le_bytes().as_ref()],
        bump = round_state.bump,
    )]
    pub round_state: Account<'info, RoundState>,
}

pub fn handler(ctx: Context<DrainTick>, round_id: u64) -> Result<()> {
    let round = &mut ctx.accounts.round_state;
    if round.status != RoundStatus::Active {
        return Ok(());
    }

    let clock = Clock::get()?;
    let now = clock.unix_timestamp;

    let elapsed = (now - round.last_drain_timestamp).max(0);
    if elapsed == 0 {
        return Ok(());
    }

    let drain_amount = (elapsed as u32).saturating_mul(round.current_drain_rate as u32);
    round.last_drain_timestamp = now;

    for i in 0..8 {
        if !round.nations[i].is_eliminated {
            if (round.nations[i].meter as u32) <= drain_amount {
                round.nations[i].meter = 0;
                round.nations[i].is_eliminated = true;
                round.nations[i].eliminated_at_timestamp = now;
                round.alive_nations_count = round.alive_nations_count.saturating_sub(1);
                round.current_drain_rate = round.current_drain_rate.saturating_add(ACCELERATION_PER_DEATH);

                let nation_id = round.nations[i].nation_id;
                let new_drain_rate = round.current_drain_rate;
                let alive_remaining = round.alive_nations_count;

                emit!(NationEliminated {
                    round_id,
                    nation_id,
                    eliminated_at: now,
                    new_drain_rate,
                    alive_remaining,
                });

                msg!(
                    "💥 ELIMINATED: Nation {} fell! Survivors: {}, Accelerated Drain: {}/s",
                    nation_id,
                    alive_remaining,
                    new_drain_rate
                );
            } else {
                round.nations[i].meter = (round.nations[i].meter as u32 - drain_amount) as u16;
            }
        }
    }

    // Check for Round Finale: Last Nation Standing
    if round.alive_nations_count <= 1 {
        round.status = RoundStatus::Settled;
        round.settled_at_timestamp = now;

        for i in 0..8 {
            if !round.nations[i].is_eliminated {
                round.winner_nation_id = round.nations[i].nation_id;
                break;
            }
        }

        emit!(RoundEnded {
            round_id,
            winner_nation_id: round.winner_nation_id,
            total_actions: round.total_actions,
            total_participants: round.total_participants,
            settled_at: now,
        });

        msg!(
            "🏆 ROUND {} SETTLED! Champion: Nation {}, Total Actions: {}",
            round_id,
            round.winner_nation_id,
            round.total_actions
        );
    }

    Ok(())
}

#[event]
pub struct NationEliminated {
    pub round_id: u64,
    pub nation_id: u8,
    pub eliminated_at: i64,
    pub new_drain_rate: u16,
    pub alive_remaining: u8,
}

#[event]
pub struct RoundEnded {
    pub round_id: u64,
    pub winner_nation_id: u8,
    pub total_actions: u32,
    pub total_participants: u32,
    pub settled_at: i64,
}
