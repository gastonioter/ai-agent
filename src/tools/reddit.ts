import { z } from 'zod';
import type { ToolFn } from '../../types';

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
  const { data } = await fetch('https://www.reddit.com/r/aww/.json').then(
    (res) => res.json()
  );

  const relevantInfo = data.children.map((child: any) => ({
    title: child.data.title,
    link: child.data.url,
    subreddit: child.data.subreddit_name_prefixed,
    author: child.data.author,
    upvotes: child.data.ups,
  }));

  return JSON.stringify(relevantInfo, null, 2);
};
