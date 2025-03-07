import { ERC20_CONSTANTS } from '../constants';

/**
 * Find a token address by name or symbol
 * @param nameOrSymbol - The token name or symbol to search for (case insensitive)
 * @returns The token address if found, undefined otherwise
 */
export function findTokenAddress(nameOrSymbol: string): string | undefined {
    // Normalize the input to uppercase for case-insensitive comparison
    const normalizedInput = nameOrSymbol.toUpperCase();

    // Check for exact matches with token symbols in constants
    if (normalizedInput === 'USDT' || normalizedInput === 'TETHER') {
        return ERC20_CONSTANTS.TOKENS.USDT;
    }

    if (normalizedInput === 'USDC' || normalizedInput === 'USD COIN') {
        return ERC20_CONSTANTS.TOKENS.USDC;
    }

    // Check if the input is already an address (starts with 0x)
    if (nameOrSymbol.startsWith('0x') && nameOrSymbol.length === 42) {
        return nameOrSymbol;
    }

    // No match found
    return undefined;
}

/**
 * Get a human-readable name for a token address
 * @param address - The token address
 * @returns The token name if known, or the address itself
 */
export function getTokenName(address: string): string {
    // Normalize the address to lowercase for comparison
    const normalizedAddress = address.toLowerCase();

    if (normalizedAddress === ERC20_CONSTANTS.TOKENS.USDT.toLowerCase()) {
        return 'USDT (Tether)';
    }

    if (normalizedAddress === ERC20_CONSTANTS.TOKENS.USDC.toLowerCase()) {
        return 'USDC (USD Coin)';
    }

    // Return the address if no known name
    return address;
} 