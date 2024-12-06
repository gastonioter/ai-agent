import 'dotenv/config'
import { runLLM } from './src/llm'
import type { AIMessage } from './types'
import { addMessages, getMessages } from './src/memory'
const userMessage = process.argv[2]

if (!userMessage) {
  console.error('Please provide a message')
  process.exit(1)
}

const currentMessage: AIMessage = {
  role: 'user',
  content: userMessage,
}

const previousContext: AIMessage[] = await getMessages()

const response = await runLLM({
  messages: [...previousContext, currentMessage],
})

addMessages([
  ...previousContext,
  currentMessage,
  { role: 'assistant', content: response.content },
])

console.log(response.content)
