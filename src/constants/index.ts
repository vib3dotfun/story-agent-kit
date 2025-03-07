import { defineChain } from 'viem';

// Define story chain
export const story = defineChain({
    id: 1514,
    name: 'story',
    nativeCurrency: {
        decimals: 18,
        name: 'IP',
        symbol: 'IP',
    },
    rpcUrls: {
        default: {
            http: [process.env.RPC_URL || 'https://mainnet.storyrpc.io'],
        },
        public: {
            http: [process.env.RPC_URL || 'https://mainnet.storyrpc.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'story Explorer',
            url: 'https://explorer.story.foundation/',
        },
    },
});

// Default options
export const DEFAULT_OPTIONS = {
    rpcUrl: process.env.RPC_URL || 'https://mainnet.storyrpc.io',
}; 