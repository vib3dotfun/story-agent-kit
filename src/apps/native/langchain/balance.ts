import { Tool } from 'langchain/tools';
import { StoryAgentKit } from '../../../agent';
import { get_balance } from '../tools';

export class NativeBalanceTool extends Tool {
    name = 'native_balance';
    description = `Get the balance of a Story wallet.
  If you want to get the balance of your wallet, you don't need to provide the address.
  
  Inputs (input is a JSON string):
  address: string (optional) - The address to check balance for`;

    constructor(private storyKit: StoryAgentKit) {
        super();
    }

    protected async _call(input: string): Promise<string> {
        try {
            const params = input ? JSON.parse(input) : {};
            const result = await get_balance(this.storyKit, params.address);

            return JSON.stringify(result);
        } catch (error: any) {
            return JSON.stringify({
                status: 'error',
                message: error.message,
                code: error.code || 'UNKNOWN_ERROR',
            });
        }
    }
} 