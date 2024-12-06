import { z } from 'zod';
import type { ToolFn } from '../../types';
import fetch from 'node-fetch';

export const redditToolDefinition = {
  name: 'reddit',
  parameters: z.object({
    reasoning: z.string().describe('why did you pick this?.'),
  }),
  description: 'get the lastes post from reddit',
};

type Args = z.infer<typeof redditToolDefinition.parameters>;

export const redditTool: ToolFn<Args, string> = async ({
  toolArgs,
  userMessage,
}) => {
  const response = await fetch('https://www.reddit.com/.json', {
    agent: 'myapp',
  });

  console.log(response);
  if (!response.ok) {
    return 'Error fetching data';
  }

  const data = await response.json();

  const relevantInfo = data.children.map((child: any) => ({
    title: child.data.title,
    link: child.data.url,
    subreddit: child.data.subreddit_name_prefixed,
    author: child.data.author,
    upvotes: child.data.ups,
  }));

  try {
    return JSON.stringify(relevantInfo, null, 2);
  } catch (error) {
    return 'Error parsing data';
  }
};
