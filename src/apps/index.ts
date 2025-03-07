import { StoryAgentKit } from '../agent';
import { createNativeTools } from './native/langchain';

/**
 * Create all LangChain tools for all supported dapps
 * @param storyKit - The StoryAgentKit instance
 * @returns An array of LangChain tools
 */
export function createAllTools(storyKit: StoryAgentKit) {
    return [
        ...createNativeTools(storyKit),
        // Add more dapp tools here as they are implemented
        // ...createUniswapTools(storyKit),
        // ...createOpenseaTools(storyKit),
    ];
} 