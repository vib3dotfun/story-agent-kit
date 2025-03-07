import { Tool } from 'langchain/tools';
import { StoryAgentKit } from '../../../agent';

export class NativeBalanceTool extends Tool {
    name = 'native_balance';
    description = `Get the balance of a story wallet.
  If you want to get the balance of your wallet, you don't need to provide the address.
  
  Inputs (input is a JSON string):
  address: string (optional) - The address to check balance for`;

    constructor(private storyKit: StoryAgentKit) {
        super();
    }

    protected async _call(input: string): Promise<string> {
        try {
            const params = input ? JSON.parse(input) : {};
            const balance = await this.storyKit.getBalance(params.address);
            const address = params.address || this.storyKit.getWalletAddress();

            return JSON.stringify({
                status: 'success',
                balance,
                address,
            });
        } catch (error: any) {
            return JSON.stringify({
                status: 'error',
                message: error.message,
                code: error.code || 'UNKNOWN_ERROR',
            });
        }
    }
} 