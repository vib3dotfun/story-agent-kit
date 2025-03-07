import { z } from 'zod';
import { StoryAgentKit } from '../agent';

/**
 * Example object for actions
 */
export interface Example {
    input: Record<string, any>;
    output: Record<string, any>;
    explanation: string;
}

/**
 * Action interface for StoryAgentKit
 */
export interface Action {
    name: string;
    similes: string[];
    description: string;
    examples: Array<Array<Example>>;
    schema: z.ZodSchema;
    handler: (agent: StoryAgentKit, input: Record<string, any>) => Promise<Record<string, any>>;
} 