use anchor_lang::prelude::*;
use crate::state::{RoundState, RoundStatus, PlayerState, METER_CAPACITY, SUPPORT_COST, SUPPORT_GAIN, COOLDOWN_SECONDS};
use crate::errors::PavilionError;

#[derive(Accounts)]
#[instruction(round_id: u64, nation_id: u8)]
pub struct SupportNation<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        seeds = [b"round", round_id.to_le_bytes().as_ref()],
        bump = round_state.bump,
    )]
    pub round_state: Account<'info, RoundState>,

    #[account(
        mut,
        seeds = [b"player", round_id.to_le_bytes().as_ref(), player.key().as_ref()],
        bump = player_state.bump,
    )]
    pub player_state: Account<'info, PlayerState>,
}

pub fn handler(ctx: Context<SupportNation>, round_id: u64, nation_id: u8) -> Result<()> {
    require!(nation_id < 8, PavilionError::InvalidNationId);

    let round = &mut ctx.accounts.round_state;
    require!(round.status == RoundStatus::Active, PavilionError::RoundNotActive);

    let nation = &mut round.nations[nation_id as usize];
    require!(!nation.is_eliminated, PavilionError::NationEliminated);

    let player_state = &mut ctx.accounts.player_state;
    require!(player_state.influence_remaining >= SUPPORT_COST, PavilionError::InsufficientInfluence);

    let clock = Clock::get()?;
    let now = clock.unix_timestamp;

    // Enforce 1-second server-side cooldown to preserve the tension curve
    require!(
        now - player_state.last_support_timestamp >= COOLDOWN_SECONDS,
        PavilionError::CooldownActive
    );

    // Deduct 10 Influence
    player_state.influence_remaining = player_state.influence_remaining.saturating_sub(SUPPORT_COST);
    player_state.influence_spent_per_nation[nation_id as usize] =
        player_state.influence_spent_per_nation[nation_id as usize].saturating_add(SUPPORT_COST);
    player_state.total_spent = player_state.total_spent.saturating_add(SUPPORT_COST);
    player_state.last_support_timestamp = now;

    // Increment nation meter +50 (capped at 1000)
    let new_meter = (nation.meter as u32 + SUPPORT_GAIN as u32).min(METER_CAPACITY as u32) as u16;
    nation.meter = new_meter;
    nation.total_influence_spent = nation.total_influence_spent.saturating_add(SUPPORT_COST as u32);

    if player_state.influence_spent_per_nation[nation_id as usize] == SUPPORT_COST {
        nation.total_supporters = nation.total_supporters.saturating_add(1);
    }

    round.total_actions = round.total_actions.saturating_add(1);

    emit!(NationSupported {
        round_id,
        nation_id,
        player: player_state.player,
        new_meter,
        remaining_influence: player_state.influence_remaining,
        timestamp: now,
    });

    msg!(
        "Support: Nation {} +{} (Meter: {}), Player remaining: {}",
        nation_id,
        SUPPORT_GAIN,
        new_meter,
        player_state.influence_remaining
    );

    Ok(())
}

#[event]
pub struct NationSupported {
    pub round_id: u64,
    pub nation_id: u8,
    pub player: Pubkey,
    pub new_meter: u16,
    pub remaining_influence: u16,
    pub timestamp: i64,
}
