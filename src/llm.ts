import { zodFunction } from 'openai/helpers/zod.mjs'
import type { AIMessage } from '../types'
import { openai } from './ai'

export const runLLM = async ({
  model = 'gpt-4o-mini-2024-07-18',
  messages,
  temperature = 0.1,
  tools,
}: {
  messages: AIMessage[]
  temperature?: number
  model?: string
  tools: any[]
}) => {
  const formattedTools = tools.map(zodFunction)

  const response = await openai.chat.completions.create({
    model,
    messages,
    temperature,
    tools: formattedTools,
    tool_choice: 'auto',
    parallel_tool_calls: false,
  })

  //console.log(response.usage)

  return response.choices[0].message
}
