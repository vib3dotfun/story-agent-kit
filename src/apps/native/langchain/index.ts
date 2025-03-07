import { NativeBalanceTool } from './balance';
import { NativeTransferTool } from './transfer';
import { StoryAgentKit } from '../../../agent';

export function createNativeTools(storyKit: StoryAgentKit) {
    return [
        new NativeBalanceTool(storyKit),
        new NativeTransferTool(storyKit),
    ];
} 