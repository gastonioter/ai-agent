import { z } from 'zod';
import type { ToolFn } from '../../types';
import { openai } from '../ai';

export const generateImageTooDefinition = {
  name: 'generate_image',
  description: 'generate an image',
  parameters: z.object({
    prompt: z.string().describe(
      `Prompt for the image. Be sure to consider the user's original message when making the prompt. If you're unsure, then ask the user to provide more details. 
      `
    ),
  }),
};
type Args = z.infer<typeof generateImageTooDefinition.parameters>;

export const generateImageTool: ToolFn<Args, string> = async ({
  toolArgs,
  userMessage,
}) => {
  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: toolArgs.prompt,
    n: 1,
    size: '512x512',
  });

  return response.data[0].url as string;
};
