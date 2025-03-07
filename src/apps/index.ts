import { StoryAgentKit } from '../agent';
import { createNativeTools } from './native/langchain';
import { createERC20Tools } from './erc20/langchain';

/**
 * Create all LangChain tools for all supported dapps
 * @param storyKit - The StoryAgentKit instance
 * @returns An array of LangChain tools
 */
export function createAllTools(storyKit: StoryAgentKit) {
    return [
        ...createNativeTools(storyKit),
        ...createERC20Tools(storyKit),
        // Add more dapp tools here as they are implemented
        // ...createUniswapTools(storyKit),
        // ...createOpenseaTools(storyKit),
    ];
} 