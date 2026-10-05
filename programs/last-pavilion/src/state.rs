use anchor_lang::prelude::*;

pub const METER_CAPACITY: u16 = 1000;
pub const STARTING_DRAIN_RATE: u16 = 6;
pub const ACCELERATION_PER_DEATH: u16 = 4;
pub const SUPPORT_COST: u16 = 10;
pub const SUPPORT_GAIN: u16 = 50;
pub const STARTING_INFLUENCE: u16 = 100;
pub const DEATH_REFUND_POOL: u32 = 30;
pub const COOLDOWN_SECONDS: i64 = 1;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq, Debug)]
pub enum RoundStatus {
    Waiting,
    Active,
    Settled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, Debug, Default)]
pub struct NationState {
    pub nation_id: u8,
    pub meter: u16,
    pub is_eliminated: bool,
    pub eliminated_at_timestamp: i64,
    pub total_influence_spent: u32,
    pub total_supporters: u32,
}

impl NationState {
    pub const LEN: usize = 1 + 2 + 1 + 8 + 4 + 4; // 20 bytes
}

#[account]
#[derive(Debug)]
pub struct RoundState {
    pub round_id: u64,
    pub status: RoundStatus,
    pub start_timestamp: i64,
    pub last_drain_timestamp: i64,
    pub current_drain_rate: u16,
    pub alive_nations_count: u8,
    pub winner_nation_id: u8, // 255 if none yet
    pub total_actions: u32,
    pub total_participants: u32,
    pub settled_at_timestamp: i64,
    pub nations: [NationState; 8],
    pub authority: Pubkey,
    pub bump: u8,
}

impl RoundState {
    pub const SPACE: usize = 8 // discriminator
        + 8 // round_id
        + 1 // status
        + 8 // start_timestamp
        + 8 // last_drain_timestamp
        + 2 // current_drain_rate
        + 1 // alive_nations_count
        + 1 // winner_nation_id
        + 4 // total_actions
        + 4 // total_participants
        + 8 // settled_at_timestamp
        + (8 * NationState::LEN) // 8 * 20 = 160
        + 32 // authority
        + 1 // bump
        + 32; // buffer padding
}

#[account]
#[derive(Debug)]
pub struct PlayerState {
    pub player: Pubkey,
    pub round_id: u64,
    pub influence_remaining: u16,
    pub last_support_timestamp: i64,
    pub influence_spent_per_nation: [u16; 8],
    pub refunds_claimed_mask: u8, // bit i is set if refund for nation i was claimed
    pub total_spent: u16,
    pub bump: u8,
}

impl PlayerState {
    pub const SPACE: usize = 8 // discriminator
        + 32 // player
        + 8  // round_id
        + 2  // influence_remaining
        + 8  // last_support_timestamp
        + (8 * 2) // influence_spent_per_nation: 16 bytes
        + 1  // refunds_claimed_mask
        + 2  // total_spent
        + 1  // bump
        + 16; // padding
}

#[account]
#[derive(Debug)]
pub struct SettlementRecord {
    pub round_id: u64,
    pub winner_nation_id: u8,
    pub total_actions: u32,
    pub total_participants: u32,
    pub duration_seconds: u32,
    pub settled_at_timestamp: i64,
    pub authority: Pubkey,
    pub bump: u8,
}

impl SettlementRecord {
    pub const SPACE: usize = 8 // discriminator
        + 8 // round_id
        + 1 // winner_nation_id
        + 4 // total_actions
        + 4 // total_participants
        + 4 // duration_seconds
        + 8 // settled_at_timestamp
        + 32 // authority
        + 1 // bump
        + 32; // padding
}
