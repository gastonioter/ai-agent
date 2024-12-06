import { z } from 'zod';
import type { ToolFn } from '../../types';

export const dadJokeToolDefinition = {
  name: 'get_dadjoke',
  description: 'use this tool only when somone ask you for a dad joke',
  parameters: z.object({
    reasoning: z.string().describe('why did you pick this?.'),
  }),
};

type Args = z.infer<typeof dadJokeToolDefinition.parameters>;

export const dadJokeTool: ToolFn<Args, string> = async ({
  toolArgs,
  userMessage,
}) => {
  console.log(toolArgs);
  const res = await fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json',
    },
  });
  if (res.ok) {
    const data = (await res.json()) as { joke: string };
    return data.joke;
  }

  return `the joke can't be generated. maybe try later`;
};
