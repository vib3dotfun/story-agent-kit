import { StoryAgentKit } from '../../../src';
import { createERC20Tools } from '../../../src/apps/erc20/langchain';
import 'dotenv/config';
import { erc20Tools } from '../../../src/apps/erc20/tools';

/**
 * Test for native app functionality
 */
async function testERC20App() {
    console.log('=== Testing ERC20 App ===');

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

        // Create LangChain tools for ERC20 app
        const tools = createERC20Tools(storyKit);
        console.log('Available ERC20 tools:', tools.map(tool => tool.name));

        // Check USDT balance
        const usdtAddress = '0x674843c06ff83502ddb4d37c2e09c01cda38cbc8';
        const balance = await erc20Tools.getTokenBalance(storyKit, usdtAddress, storyKit.getWalletAddress());
        console.log('Wallet balance:', balance, 'USDT');

        // Test balance tool
        const balanceTool = tools.find(tool => tool.name === 'erc20_balance');
        if (balanceTool) {
            const balanceResult = await balanceTool.call(JSON.stringify({ tokenAddress: usdtAddress, ownerAddress: storyKit.getWalletAddress() }));
            console.log('Balance tool result:', balanceResult);
        } else {
            console.error('Balance tool not found');
        }

        // Note: We're not testing the transfer tool here as it would actually send tokens
        console.log('Native app test completed successfully!');
    } catch (error) {
        console.error('Error in native app test:', error);
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    testERC20App();
}

export { testERC20App }; 