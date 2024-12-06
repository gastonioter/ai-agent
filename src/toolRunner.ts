import type OpenAI from 'openai';

const getWeather = async ({
  userMessage,
  ...toolArgs
}: {
  userMessage: string;
}) => {
  console.log(userMessage);
  console.log(toolArgs);

  return Promise.resolve(`very cold. 17deg`);
};

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
    case 'get_weather':
      return await getWeather(input);

    default:
      return `Please, stop calling ${toolCall.function.name} function, it doesn't exists`;
  }
};
