import 'dotenv/config'
import { runLLM } from './src/llm'
import type { AIMessage } from './types'
import { addMessages, getMessages } from './src/memory'
import { runAgent } from './src/agent'
import { z } from 'zod'
const userMessage = process.argv[2]

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}

/* *********** */
// Chat Based
/* *********** */

// const currentMessage: AIMessage = {
//   role: 'user',
//   content: userMessage,
// }

// const previousContext: AIMessage[] = await getMessages()

// const response = await runLLM({
//   messages: [...previousContext, currentMessage],
//   tools: [],
// })

// addMessages([
//   ...previousContext,
//   currentMessage,
//   { role: 'assistant', content: response.content },
// ])

// console.log(response.content)

/* *********** */
// Agents
/* *********** */

// functoin definition

const weatherToolParameters = z.object({
  reasoning: z.string().describe('why did you pick this tool?'),
})
const weatherTool = {
  name: 'get_weather',
  // when to call this tool
  description:
    'information about the weather in Argentina. Dont use this for any other city',
  parameters: weatherToolParameters,
}
const response = await runAgent({ userMessage, tools: [weatherTool] })
