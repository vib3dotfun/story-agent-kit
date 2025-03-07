import { Tool } from 'langchain/tools';
import { StoryAgentKit } from '../../../agent';
import { metapoolTools } from '../tools';

/**
 * LangChain tool for getting the Total Value Locked (TVL) in the Metapool contract
 */
export class MetapoolTVLTool extends Tool {
    name = 'metapool_tvl';
    description = `Get the Total Value Locked (TVL) in the Metapool contract on Story Protocol.
    
    Metapool is a multichain application, but this tool specifically checks the TVL on Story Protocol.
    This tool takes no inputs and returns the current TVL (in stIP, means staked IP) in the Metapool contract.`;

    private agent: StoryAgentKit;

    constructor(agent: StoryAgentKit) {
        super();
        this.agent = agent;
    }

    async _call(args: string): Promise<string> {
        try {
            // Get the TVL
            const tvlData = await metapoolTools.getTotalValueLocked(this.agent);

            return JSON.stringify({
                status: 'success',
                tvl: tvlData.amount,
                symbol: tvlData.symbol,
                formattedTvl: `${tvlData.amount} ${tvlData.symbol}`
            });
        } catch (error: any) {
            return JSON.stringify({
                status: 'error',
                message: error.message || 'An error occurred while getting the TVL',
                code: error.code
            });
        }
    }
}

/**
 * LangChain tool for staking IP tokens in the Metapool contract
 */
export class MetapoolStakeTool extends Tool {
    name = 'metapool_stake';
    description = `Stake native IP tokens in the Metapool contract on Story Protocol to receive stIP tokens.
    
    Metapool is a multichain application, but this tool specifically stakes native IP tokens on Story Protocol.
    This action allows you to deposit your native IP tokens and receive staked IP (stIP) tokens in return.
    
    Inputs (input is a JSON string):
    amount: string - The amount of native IP tokens to stake`;

    private agent: StoryAgentKit;

    constructor(agent: StoryAgentKit) {
        super();
        this.agent = agent;
    }

    async _call(args: string): Promise<string> {
        try {
            // Parse the input JSON
            const input = JSON.parse(args);

            // Validate required fields
            if (!input.amount) {
                return JSON.stringify({
                    status: 'error',
                    message: 'Missing required field: amount'
                });
            }

            // Stake the IP tokens
            const txHash = await metapoolTools.stakeIP(this.agent, input.amount);

            return JSON.stringify({
                status: 'success',
                txHash,
                amount: input.amount
            });
        } catch (error: any) {
            return JSON.stringify({
                status: 'error',
                message: error.message || 'An error occurred while staking IP tokens',
                code: error.code
            });
        }
    }
}

/**
 * LangChain tool for unstaking stIP tokens from the Metapool contract
 */
export class MetapoolUnstakeTool extends Tool {
    name = 'metapool_unstake';
    description = `Unstake stIP tokens from the Metapool contract on Story Protocol to receive IP tokens.
    
    Metapool is a multichain application, but this tool specifically unstakes stIP tokens on Story Protocol.
    This action allows you to withdraw your staked IP tokens. Note: Funds will be released after a 14-day waiting period, and the minimum unstake amount is 0.1 stIP.
    
    Inputs (input is a JSON string):
    amount: string - The amount of stIP tokens to unstake, or "all" to unstake all your stIP tokens`;

    private agent: StoryAgentKit;

    constructor(agent: StoryAgentKit) {
        super();
        this.agent = agent;
    }

    async _call(args: string): Promise<string> {
        try {
            // Parse the input JSON
            const input = JSON.parse(args);

            // Validate required fields
            if (!input.amount) {
                return JSON.stringify({
                    status: 'error',
                    message: 'Missing required field: amount'
                });
            }

            // If amount is not "all", check if it's at least 0.1 IP
            if (input.amount.toLowerCase() !== 'all' && parseFloat(input.amount) < 0.1) {
                return JSON.stringify({
                    status: 'error',
                    message: 'Minimum unstake amount is 0.1 stIP'
                });
            }

            // If amount is "all", get the user's balance for the response
            let userBalance: string | undefined;
            if (input.amount.toLowerCase() === 'all') {
                userBalance = await metapoolTools.getStIPBalance(this.agent);
            }

            // Unstake the stIP tokens
            const txHash = await metapoolTools.unstakeIP(this.agent, input.amount);

            return JSON.stringify({
                status: 'success',
                txHash,
                amount: input.amount.toLowerCase() === 'all' ? userBalance : input.amount,
                unstakeAll: input.amount.toLowerCase() === 'all',
                note: 'Your funds will be released after a 14-day waiting period'
            });
        } catch (error: any) {
            return JSON.stringify({
                status: 'error',
                message: error.message || 'An error occurred while unstaking stIP tokens',
                code: error.code
            });
        }
    }
}

/**
 * LangChain tool for getting the current APY for staking IP tokens on Metapool
 */
export class MetapoolAPYTool extends Tool {
    name = 'metapool_apy';
    description = `Get the current APY (Annual Percentage Yield) for staking IP tokens on Metapool.
    
    This tool returns the current APY as well as historical APY values for different time periods (3-day, 7-day, 15-day, and 30-day).
    This information can help users make informed decisions about staking their IP tokens.
    
    This tool takes no inputs.`;

    async _call(args: string): Promise<string> {
        try {
            // Get the APY data
            const apyData = await metapoolTools.getStakingAPY();

            return JSON.stringify({
                status: 'success',
                apy: apyData.apy,
                threeDay: apyData.threeDay,
                sevenDay: apyData.sevenDay,
                fifteenDay: apyData.fifteenDay,
                thirtyDay: apyData.thirtyDay,
                formattedAPY: `${apyData.apy}%`
            });
        } catch (error: any) {
            return JSON.stringify({
                status: 'error',
                message: error.message || 'An error occurred while getting the APY data',
                code: error.code
            });
        }
    }
}

/**
 * Create all LangChain tools for Metapool interactions
 * @param agent - The StoryAgentKit instance
 * @returns An array of LangChain tools for Metapool interactions
 */
export function createMetapoolTools(agent: StoryAgentKit) {
    return [
        new MetapoolTVLTool(agent),
        new MetapoolStakeTool(agent),
        new MetapoolUnstakeTool(agent),
        new MetapoolAPYTool(),
        // Add more Metapool tools here as they are implemented
    ];
} 