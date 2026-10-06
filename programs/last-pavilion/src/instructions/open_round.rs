use anchor_lang::prelude::*;
use ephemeral_rollups_sdk::anchor::delegate;
use ephemeral_rollups_sdk::cpi::DelegateConfig;
use crate::state::{RoundState, RoundStatus, NationState, METER_CAPACITY, STARTING_DRAIN_RATE};

pub const TEE_VALIDATOR: Pubkey = pubkey!("MTEWGuqxUpYZGFJQcp8tLN7x5v9BSeoFHYWQQ3n3xzo");

#[derive(Accounts)]
#[instruction(round_id: u64)]
pub struct InitializeRound<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = RoundState::SPACE,
        seeds = [b"round", round_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub round_state: Account<'info, RoundState>,

    pub system_program: Program<'info, System>,
}

pub fn handle_initialize(ctx: Context<InitializeRound>, round_id: u64) -> Result<()> {
    let clock = Clock::get()?;
    let now = clock.unix_timestamp;

    let round = &mut ctx.accounts.round_state;
    round.round_id = round_id;
    round.status = RoundStatus::Active;
    round.start_timestamp = now;
    round.last_drain_timestamp = now;
    round.current_drain_rate = STARTING_DRAIN_RATE;
    round.alive_nations_count = 8;
    round.winner_nation_id = 255;
    round.total_actions = 0;
    round.total_participants = 0;
    round.settled_at_timestamp = 0;
    round.authority = ctx.accounts.authority.key();
    round.bump = ctx.bumps.round_state;

    for i in 0..8 {
        round.nations[i] = NationState {
            nation_id: i as u8,
            meter: METER_CAPACITY,
            is_eliminated: false,
            eliminated_at_timestamp: 0,
            total_influence_spent: 0,
            total_supporters: 0,
        };
    }

    emit!(RoundOpened {
        round_id,
        start_timestamp: now,
        authority: ctx.accounts.authority.key(),
    });

    msg!("Round {} initialized on Solana", round_id);
    Ok(())
}

#[delegate]
#[derive(Accounts)]
#[instruction(round_id: u64)]
pub struct DelegateRound<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        del,
        seeds = [b"round", round_id.to_le_bytes().as_ref()],
        bump = round_state.bump,
    )]
    pub round_state: Account<'info, RoundState>,
}

pub fn handle_delegate(ctx: Context<DelegateRound>, round_id: u64) -> Result<()> {
    let bump = ctx.accounts.round_state.bump;

    // Delegate the account to the MagicBlock TEE Ephemeral Rollup validator.
    ctx.accounts.delegate_round_state(
        &ctx.accounts.authority,
        &[b"round", round_id.to_le_bytes().as_ref(), &[bump]],
        DelegateConfig {
            validator: Some(TEE_VALIDATOR),
            ..Default::default()
        },
    )?;

    msg!("Round {} delegated to MagicBlock TEE Ephemeral Rollup", round_id);
    Ok(())
}

#[event]
pub struct RoundOpened {
    pub round_id: u64,
    pub start_timestamp: i64,
    pub authority: Pubkey,
}
