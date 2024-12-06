import { runLLM } from './llm';
import { addMessages, getMessages, saveToolMessage } from './memory';
import { runTool } from './toolRunner';
import { logMessage, showLoader } from './ui';

export const runAgent = async ({
  userMessage,
  tools,
}: {
  userMessage: string;
  tools: any[];
}) => {
  await addMessages([{ role: 'user', content: userMessage }]);

  const loader = showLoader('Thinking');

  // Agent Loop
  while (true) {
    const history = await getMessages();

    const response = await runLLM({
      messages: history,
      tools,
    });

    await addMessages([response]);

    if (response.content) {
      loader.stop();
      return logMessage(response);
    }

    if (response.tool_calls) {
      // call the tool
      const toolCall = response.tool_calls[0];
      loader.update(`executing: ${toolCall.function.name}`);
      const toolResponse = await runTool(toolCall, userMessage);

      // save the response
      await saveToolMessage(toolResponse, toolCall.id);
      loader.update(`done: ${toolCall.function.name}`);
    }
  }
};
