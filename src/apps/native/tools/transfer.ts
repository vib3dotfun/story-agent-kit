import { StoryAgentKit } from '../../../agent';

/**
 * Transfer native tokens to another address
 * @param agent - The StoryAgentKit instance
 * @param to - The recipient address
 * @param amount - The amount to transfer in ETH
 * @returns The transaction hash
 */
export async function transfer(
    agent: StoryAgentKit,
    to: string,
    amount: string
): Promise<string> {
    return agent.transfer(to, amount);
} 