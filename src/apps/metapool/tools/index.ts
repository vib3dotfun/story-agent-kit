import { StoryAgentKit } from '../../../agent';
import stakedIpAbi from '../abi/stakedip.json';
import { METAPOOL_CONSTANTS } from '../constants';
import { formatUnits, parseEther, parseUnits } from 'viem';

/**
 * Get the Total Value Locked (TVL) in the Metapool contract
 * @param agent - The StoryAgentKit instance
 * @returns An object containing the TVL amount and symbol
 */
export async function getTotalValueLocked(
    agent: StoryAgentKit
): Promise<{ amount: string; symbol: string }> {
    try {
        // Call the totalAssets function on the StakedIP contract
        const totalAssets = await agent.publicClient.readContract({
            address: METAPOOL_CONSTANTS.CONTRACTS.STAKED_IP as `0x${string}`,
            abi: stakedIpAbi,
            functionName: 'totalAssets'
        });

        // Get the decimals to format the result properly
        const decimals = await agent.publicClient.readContract({
            address: METAPOOL_CONSTANTS.CONTRACTS.STAKED_IP as `0x${string}`,
            abi: stakedIpAbi,
            functionName: 'decimals'
        });

        // Get the symbol of the token
        const symbol = await agent.publicClient.readContract({
            address: METAPOOL_CONSTANTS.CONTRACTS.STAKED_IP as `0x${string}`,
            abi: stakedIpAbi,
            functionName: 'symbol'
        });

        // Format the total assets based on the decimals
        const formattedAmount = formatUnits(totalAssets as bigint, Number(decimals));

        return {
            amount: formattedAmount,
            symbol: symbol as string
        };
    } catch (error: any) {
        console.error('Error getting total value locked:', error);
        throw new Error(`Failed to get total value locked: ${error.message}`);
    }
}

/**
 * Stake IP tokens in the Metapool contract to receive stIP tokens
 * @param agent - The StoryAgentKit instance
 * @param amount - The amount of IP tokens to stake
 * @returns The transaction hash
 */
export async function stakeIP(
    agent: StoryAgentKit,
    amount: string
): Promise<string> {
    try {
        // Parse the amount based on the token's decimals
        const receiver = agent.getWalletAddress() as `0x${string}`;

        // Prepare the transaction - depositIP is a payable function that accepts native IP tokens
        const { request } = await agent.publicClient.simulateContract({
            address: METAPOOL_CONSTANTS.CONTRACTS.STAKED_IP as `0x${string}`,
            abi: stakedIpAbi,
            functionName: 'depositIP',
            args: [receiver],
            value: parseEther(amount) // Set the transaction value to send native IP tokens
        });

        // Send the transaction
        const txHash = await agent.walletClient.writeContract(request);

        return txHash;
    } catch (error: any) {
        console.error('Error staking IP tokens:', error);
        throw new Error(`Failed to stake IP tokens: ${error.message}`);
    }
}

/**
 * Unstake stIP tokens from the Metapool contract to receive IP tokens
 * @param agent - The StoryAgentKit instance
 * @param amount - The amount of stIP tokens to unstake, or "all" to unstake all
 * @returns The transaction hash
 */
export async function unstakeIP(
    agent: StoryAgentKit,
    amount: string
): Promise<string> {
    try {
        const walletAddress = agent.getWalletAddress() as `0x${string}`;
        let parsedAmount: bigint;

        // Handle "all" option
        if (amount.toLowerCase() === 'all') {
            // Get the user's stIP balance
            const balance = await agent.publicClient.readContract({
                address: METAPOOL_CONSTANTS.CONTRACTS.STAKED_IP as `0x${string}`,
                abi: stakedIpAbi,
                functionName: 'balanceOf',
                args: [walletAddress]
            }) as bigint;

            // If balance is 0, throw an error
            if (balance === 0n) {
                throw new Error('You have no stIP tokens to unstake');
            }

            parsedAmount = balance;
        } else {
            // Parse the amount based on the token's decimals
            parsedAmount = parseEther(amount);
        }

        // Prepare the transaction - redeem is the function to unstake stIP tokens
        const request = {
            address: METAPOOL_CONSTANTS.CONTRACTS.STAKED_IP as `0x${string}`,
            abi: stakedIpAbi,
            functionName: 'redeem',
            args: [
                parsedAmount,         // shares (stIP amount)
                walletAddress,        // receiver
                walletAddress         // owner
            ]
        };

        // Send the transaction
        const txHash = await agent.walletClient.writeContract(request);

        return txHash;
    } catch (error: any) {
        console.error('Error unstaking stIP tokens:', error);
        throw new Error(`Failed to unstake stIP tokens: ${error.message}`);
    }
}

/**
 * Get the stIP balance of an address
 * @param agent - The StoryAgentKit instance
 * @param address - The address to check (defaults to the wallet address)
 * @returns The stIP balance as a string
 */
export async function getStIPBalance(
    agent: StoryAgentKit,
    address?: string
): Promise<string> {
    try {
        const walletAddress = address || agent.getWalletAddress();

        // Call the balanceOf function on the StakedIP contract
        const balance = await agent.publicClient.readContract({
            address: METAPOOL_CONSTANTS.CONTRACTS.STAKED_IP as `0x${string}`,
            abi: stakedIpAbi,
            functionName: 'balanceOf',
            args: [walletAddress]
        });

        // Get the decimals to format the result properly
        const decimals = await agent.publicClient.readContract({
            address: METAPOOL_CONSTANTS.CONTRACTS.STAKED_IP as `0x${string}`,
            abi: stakedIpAbi,
            functionName: 'decimals'
        });

        // Format the balance based on the decimals
        return formatUnits(balance as bigint, Number(decimals));
    } catch (error: any) {
        console.error('Error getting stIP balance:', error);
        throw new Error(`Failed to get stIP balance: ${error.message}`);
    }
}

/**
 * Get the current APY for staking IP tokens on Metapool
 * @returns An object containing the APY and related information
 */
export async function getStakingAPY(): Promise<{
    apy: number;
    threeDay: number | null;
    sevenDay: number | null;
    fifteenDay: number | null;
    thirtyDay: number | null;
}> {
    try {
        // Fetch the metrics data from the Narwallets API
        const response = await fetch('https://validators.narwallets.com/metrics_json');

        if (!response.ok) {
            throw new Error(`Failed to fetch APY data: ${response.statusText}`);
        }

        const data = await response.json();

        // Extract the APY values
        return {
            apy: data.st_ip_apy || 0,
            threeDay: data.st_ip_3_day_apy || null,
            sevenDay: data.st_ip_7_day_apy || null,
            fifteenDay: data.st_ip_15_day_apy || null,
            thirtyDay: data.st_ip_30_day_apy || null
        };
    } catch (error: any) {
        console.error('Error getting staking APY:', error);
        throw new Error(`Failed to get staking APY: ${error.message}`);
    }
}

// Export all tools
export const metapoolTools = {
    getTotalValueLocked,
    stakeIP,
    unstakeIP,
    getStIPBalance,
    getStakingAPY
}; 