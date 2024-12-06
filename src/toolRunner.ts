import type OpenAI from 'openai';
import {
  generateImageTool,
  generateImageTooDefinition,
} from './tools/generateImage';
import { redditTool, redditToolDefinition } from './tools/reddit';
import { dadJokeTool, dadJokeToolDefinition } from './tools/dadJoke';
export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
  //   userId:string
): Promise<string> => {
  const toolArgs = JSON.parse(toolCall.function.arguments || '{}');

  const input = {
    userMessage,
    // userId
    ...toolArgs,
  };

  switch (toolCall.function.name) {
    case generateImageTooDefinition.name:
      const image = await generateImageTool(input);
      return image;

    case dadJokeToolDefinition.name:
      return dadJokeTool(input);

    case redditToolDefinition.name:
      return redditTool(input);

    default:
      return `Please, stop calling ${toolCall.function.name} function, it doesn't exists`;
  }
};
