import { runLLM } from './llm'
import { addMessages, getMessages } from './memory'
import { logMessage, showLoader } from './ui'

const MAX_CALLS = 5
// function tool
function getWeather({ reasoning }: { reasoning: string }) {
  console.log(reasoning)
  return "It's too cold outside, we're in winter"
}

export const runAgent = async ({
  userMessage,
  tools,
}: {
  userMessage: string
  tools: any[]
}) => {
  await addMessages([{ role: 'user', content: userMessage }])

  const loader = showLoader('Thinking')

  const history = await getMessages()

  let response = await runLLM({
    messages: [...history],
    tools,
  })
  let iterations = 0
  while (response.tool_calls?.length && iterations < MAX_CALLS) {
    await addMessages([response])

    let toolResponse: string = ''
    const tool = response.tool_calls[0]

    if (tool.function.name === 'get_weather') {
      const args = JSON.parse(tool.function.arguments)
      toolResponse = getWeather(args)
    }

    const toolMessage = {
      role: 'tool' as const,
      content: toolResponse,
      tool_call_id: tool.id,
    }

    await addMessages([toolMessage])

    response = await runLLM({
      messages: [...history, response, toolMessage],
      tools,
    })

    iterations++
  }

  await addMessages([response])

  loader.stop()
  logMessage(response)

  return getMessages()
}
