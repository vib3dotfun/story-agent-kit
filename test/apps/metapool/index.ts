import { StoryAgentKit } from '../../../src';
import { createMetapoolTools } from '../../../src/apps/metapool/langchain';
import { metapoolTools } from '../../../src/apps/metapool/tools';
import 'dotenv/config';

/**
 * Test for Metapool app functionality
 */
async function testMetapoolApp() {
    console.log('=== Testing Metapool App ===');

    // Load private key from environment variables
    let privateKey = process.env.WALLET_PRIVATE_KEY;

    if (!privateKey) {
        console.error('WALLET_PRIVATE_KEY is required in .env file');
        process.exit(1);
    }

    // Add 0x prefix if not present
    if (!privateKey.startsWith('0x')) {
        privateKey = `0x${privateKey}`;
    }

    try {
        // Initialize the StoryAgentKit
        const storyKit = new StoryAgentKit(privateKey);
        console.log('Wallet address:', storyKit.getWalletAddress());

        // Create LangChain tools for Metapool app
        const tools = createMetapoolTools(storyKit);
        console.log('Available Metapool tools:', tools.map(tool => tool.name));

        // Get TVL
        const tvlData = await metapoolTools.getTotalValueLocked(storyKit);
        console.log('Total Value Locked on Story Protocol:', `${tvlData.amount} ${tvlData.symbol}`);

        const tvlTool = tools.find(tool => tool.name === 'metapool_tvl');
        if (tvlTool) {
            const tvlResult = await tvlTool.call('{}');
            console.log('TVL tool result:', tvlResult);
            const parsedResult = JSON.parse(tvlResult);
            if (parsedResult.status === 'success') {
                console.log('Formatted TVL on Story Protocol:', parsedResult.formattedTvl);
            }
        } else {
            console.error('TVL tool not found');
        }

        // Test staking IP tokens
        console.log('\nTesting IP staking...');
        const stakeAmount = "0.01"; // Small amount for testing

        const stakeTool = tools.find(tool => tool.name === 'metapool_stake');
        if (stakeTool) {
            console.log(`Attempting to stake ${stakeAmount} IP tokens...`);
            const stakeResult = await stakeTool.call(JSON.stringify({ amount: stakeAmount }));
            console.log('Stake tool result:', stakeResult);

            const parsedResult = JSON.parse(stakeResult);
            if (parsedResult.status === 'success') {
                console.log(`Successfully staked ${stakeAmount} IP tokens. Transaction hash: ${parsedResult.txHash}`);
            } else {
                console.log(`Failed to stake IP tokens: ${parsedResult.message}`);
            }
        } else {
            console.error('Stake tool not found');
        }

        // Test unstaking IP tokens
        console.log('\nTesting IP unstaking...');
        const unstakeAmount = "0.1"; // Small amount for testing

        const unstakeTool = tools.find(tool => tool.name === 'metapool_unstake');
        if (unstakeTool) {
            console.log(`Attempting to unstake ${unstakeAmount} IP tokens...`);
            const unstakeResult = await unstakeTool.call(JSON.stringify({ amount: unstakeAmount }));
            console.log('Unstake tool result:', unstakeResult);

            const parsedResult = JSON.parse(unstakeResult);
            if (parsedResult.status === 'success') {
                console.log(`Successfully unstaked ${unstakeAmount} IP tokens. Transaction hash: ${parsedResult.txHash}`);
            } else {
                console.log(`Failed to unstake IP tokens: ${parsedResult.message}`);
            }
        } else {
            console.error('Unstake tool not found');
        }

        // Test getting the staking APY
        console.log('\nTesting staking APY...');

        const apyTool = tools.find(tool => tool.name === 'metapool_apy');
        if (apyTool) {
            console.log('Fetching current staking APY...');
            const apyResult = await apyTool.call('{}');
            console.log('APY tool result:', apyResult);

            const parsedResult = JSON.parse(apyResult);
            if (parsedResult.status === 'success') {
                console.log(`Current staking APY: ${parsedResult.formattedAPY}`);
                console.log(`3-day APY: ${parsedResult.threeDay}%`);
                console.log(`7-day APY: ${parsedResult.sevenDay}%`);
                console.log(`15-day APY: ${parsedResult.fifteenDay}%`);
                console.log(`30-day APY: ${parsedResult.thirtyDay !== null ? parsedResult.thirtyDay + '%' : 'Not available'}`);
            } else {
                console.log(`Failed to get staking APY: ${parsedResult.message}`);
            }
        } else {
            console.error('APY tool not found');
        }

    } catch (error) {
        console.error('Error in Metapool app test:', error);
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    testMetapoolApp();
}

export { testMetapoolApp }; 