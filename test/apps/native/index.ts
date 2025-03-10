import { StoryAgentKit } from '../../../src';
import { createNativeTools } from '../../../src/apps/native/langchain';
import { get_balance } from '../../../src/apps/native/tools';
import 'dotenv/config';

/**
 * Test for native app functionality
 */
async function testNativeApp() {
    console.log('=== Testing Native App ===');

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

        // Check balance using the native tool
        const balanceResult = await get_balance(storyKit);
        console.log('Wallet balance:', balanceResult.balance, 'ETH');

        // Create LangChain tools for native app
        const tools = createNativeTools(storyKit);
        console.log('Available native tools:', tools.map(tool => tool.name));

        // Test balance tool
        const balanceTool = tools.find(tool => tool.name === 'native_balance');
        if (balanceTool) {
            const balanceResult = await balanceTool.call('{}');
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
    testNativeApp();
}

export { testNativeApp }; 