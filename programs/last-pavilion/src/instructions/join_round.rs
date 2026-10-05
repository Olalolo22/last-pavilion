use anchor_lang::prelude::*;
use crate::state::{PlayerState, RoundState, RoundStatus, STARTING_INFLUENCE};
use crate::errors::PavilionError;

#[derive(Accounts)]
#[instruction(round_id: u64)]
pub struct JoinRound<'info> {
    #[account(mut)]
    pub player: Signer<'info>,

    #[account(
        mut,
        seeds = [b"round", round_id.to_le_bytes().as_ref()],
        bump = round_state.bump,
    )]
    pub round_state: Account<'info, RoundState>,

    #[account(
        init,
        payer = player,
        space = PlayerState::SPACE,
        seeds = [b"player", round_id.to_le_bytes().as_ref(), player.key().as_ref()],
        bump,
    )]
    pub player_state: Account<'info, PlayerState>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<JoinRound>, round_id: u64) -> Result<()> {
    let round = &mut ctx.accounts.round_state;
    require!(round.status != RoundStatus::Settled, PavilionError::RoundAlreadySettled);

    let player_state = &mut ctx.accounts.player_state;
    player_state.player = ctx.accounts.player.key();
    player_state.round_id = round_id;
    player_state.influence_remaining = STARTING_INFLUENCE;
    player_state.last_support_timestamp = 0;
    player_state.influence_spent_per_nation = [0; 8];
    player_state.refunds_claimed_mask = 0;
    player_state.total_spent = 0;
    player_state.bump = ctx.bumps.player_state;

    round.total_participants = round.total_participants.saturating_add(1);

    msg!("Player {} registered for Round {}", ctx.accounts.player.key(), round_id);
    Ok(())
}
