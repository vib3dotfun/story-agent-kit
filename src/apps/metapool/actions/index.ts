import { z } from 'zod';
import { Action, Example } from '../../../types/action';
import { StoryAgentKit } from '../../../agent';
import { metapoolTools } from '../tools';

// Schema for the getTotalValueLocked action
const getTotalValueLockedSchema = z.object({});

// Examples for the getTotalValueLocked action
const getTotalValueLockedExamples: Array<Example> = [
    {
        input: {},
        output: {
            status: "success",
            tvl: "1000000.5"
        },
        explanation: "Get the total value locked (TVL) in the Metapool contract"
    }
];

// Handler for the getTotalValueLocked action
async function getTotalValueLockedHandler(
    agent: StoryAgentKit,
    input: Record<string, any>
) {
    try {
        const tvlData = await metapoolTools.getTotalValueLocked(agent);
        return {
            status: 'success',
            tvl: tvlData.amount,
            symbol: tvlData.symbol,
            formattedTvl: `${tvlData.amount} ${tvlData.symbol}`
        };
    } catch (error: any) {
        return {
            status: 'error',
            message: error.message,
            code: error.code
        };
    }
}

// Define the getTotalValueLocked action
export const getTotalValueLockedAction: Action = {
    name: 'getTotalValueLocked',
    similes: ['check tvl', 'get metapool tvl', 'view total value locked', 'show metapool assets'],
    description: 'Get the total value locked (TVL) in the Metapool contract on Story Protocol. Metapool is a multichain application, but this action specifically checks the TVL on Story Protocol.',
    examples: [getTotalValueLockedExamples],
    schema: getTotalValueLockedSchema,
    handler: getTotalValueLockedHandler,
};

// Schema for the stakeIP action
const stakeIPSchema = z.object({
    amount: z.string().describe('The amount of IP tokens to stake')
});

// Examples for the stakeIP action
const stakeIPExamples: Array<Example> = [
    {
        input: {
            amount: "10"
        },
        output: {
            status: "success",
            txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            amount: "10"
        },
        explanation: "Stake 10 IP tokens to receive stIP tokens"
    }
];

// Handler for the stakeIP action
async function stakeIPHandler(
    agent: StoryAgentKit,
    input: Record<string, any>
) {
    try {
        const { amount } = input as z.infer<typeof stakeIPSchema>;
        const txHash = await metapoolTools.stakeIP(agent, amount);
        return {
            status: 'success',
            txHash,
            amount
        };
    } catch (error: any) {
        return {
            status: 'error',
            message: error.message,
            code: error.code
        };
    }
}

// Define the stakeIP action
export const stakeIPAction: Action = {
    name: 'stake',
    similes: ['stake ip', 'deposit ip', 'get stip', 'stake tokens', 'deposit tokens'],
    description: 'Stake native IP tokens in the Metapool contract on Story Protocol to receive stIP tokens. This action allows you to deposit your native IP tokens and receive staked IP (stIP) tokens in return.',
    examples: [stakeIPExamples],
    schema: stakeIPSchema,
    handler: stakeIPHandler,
};

// Schema for the unstakeIP action
const unstakeIPSchema = z.object({
    amount: z.string().describe('The amount of stIP tokens to unstake, or "all" to unstake all')
});

// Examples for the unstakeIP action
const unstakeIPExamples: Array<Example> = [
    {
        input: {
            amount: "1"
        },
        output: {
            status: "success",
            txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            amount: "1"
        },
        explanation: "Unstake 1 stIP token to receive IP tokens (note: funds will be released after 14 days)"
    },
    {
        input: {
            amount: "all"
        },
        output: {
            status: "success",
            txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            amount: "all"
        },
        explanation: "Unstake all your stIP tokens to receive IP tokens (note: funds will be released after 14 days)"
    }
];

// Handler for the unstakeIP action
async function unstakeIPHandler(
    agent: StoryAgentKit,
    input: Record<string, any>
) {
    try {
        const { amount } = input as z.infer<typeof unstakeIPSchema>;

        // If amount is not "all", check if it's at least 0.5 IP
        if (amount.toLowerCase() !== 'all' && parseFloat(amount) < 0.1) {
            return {
                status: 'error',
                message: 'Minimum unstake amount is 0.1 stIP'
            };
        }

        // If amount is "all", get the user's balance for the response
        let userBalance: string | undefined;
        if (amount.toLowerCase() === 'all') {
            userBalance = await metapoolTools.getStIPBalance(agent);
        }

        const txHash = await metapoolTools.unstakeIP(agent, amount);

        return {
            status: 'success',
            txHash,
            amount: amount.toLowerCase() === 'all' ? userBalance : amount,
            unstakeAll: amount.toLowerCase() === 'all',
            note: 'Your funds will be released after a 14-day waiting period'
        };
    } catch (error: any) {
        return {
            status: 'error',
            message: error.message,
            code: error.code
        };
    }
}

// Define the unstakeIP action
export const unstakeIPAction: Action = {
    name: 'unstake',
    similes: ['unstake ip', 'withdraw ip', 'redeem stip', 'unstake tokens', 'withdraw tokens'],
    description: 'Unstake stIP tokens from the Metapool contract on Story Protocol to receive IP tokens. Note: Funds will be released after a 14-day waiting period, and the minimum unstake amount is 0.1 stIP.',
    examples: [unstakeIPExamples],
    schema: unstakeIPSchema,
    handler: unstakeIPHandler,
};

// Schema for the getStakingAPY action
const getStakingAPYSchema = z.object({});

// Examples for the getStakingAPY action
const getStakingAPYExamples: Array<Example> = [
    {
        input: {},
        output: {
            status: "success",
            apy: 14.97,
            threeDay: 36.12,
            sevenDay: 15.89,
            fifteenDay: 8.1,
            thirtyDay: null
        },
        explanation: "Get the current APY for staking IP tokens on Metapool"
    }
];

// Handler for the getStakingAPY action
async function getStakingAPYHandler(
    agent: StoryAgentKit,
    input: Record<string, any>
) {
    try {
        const apyData = await metapoolTools.getStakingAPY();
        return {
            status: 'success',
            apy: apyData.apy,
            threeDay: apyData.threeDay,
            sevenDay: apyData.sevenDay,
            fifteenDay: apyData.fifteenDay,
            thirtyDay: apyData.thirtyDay
        };
    } catch (error: any) {
        return {
            status: 'error',
            message: error.message,
            code: error.code
        };
    }
}

// Define the getStakingAPY action
export const getStakingAPYAction: Action = {
    name: 'getStakingAPY',
    similes: ['check apy', 'get metapool apy', 'view staking rewards', 'show ip staking returns'],
    description: 'Get the current APY (Annual Percentage Yield) for staking IP tokens on Metapool. This action returns the current APY as well as historical APY values for different time periods.',
    examples: [getStakingAPYExamples],
    schema: getStakingAPYSchema,
    handler: getStakingAPYHandler,
};

// Update the exported actions
export const METAPOOL_ACTIONS = {
    getTotalValueLocked: getTotalValueLockedAction,
    stake: stakeIPAction,
    unstake: unstakeIPAction,
    getStakingAPY: getStakingAPYAction,
} as const; 