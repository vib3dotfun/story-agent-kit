import { StoryAgentKit } from '../../../agent';

/**
 * Get the balance of a wallet
 * @param agent - The StoryAgentKit instance
 * @param address - The address to check (optional)
 * @returns The balance in ETH
 */
export async function get_balance(
    agent: StoryAgentKit,
    address?: string
): Promise<string> {
    return agent.getBalance(address);
} 