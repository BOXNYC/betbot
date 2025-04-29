import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Keep track of chat history in memory (in a real app, use a database)
const chatHistories: Record<string, Array<OpenAI.Chat.ChatCompletionMessageParam>> = {};

export async function generateChatResponse(prompt: string, chatId?: string) {
  // Generate a new chat ID if not provided
  const currentChatId = chatId || `chat_${Date.now()}`;
  
  // Initialize chat history if it doesn't exist
  if (!chatHistories[currentChatId]) {
    chatHistories[currentChatId] = [
      { role: "system" as const, content: "You are BetBot, a helpful AI assistant." }
    ];
  }
  
  // Add user message to history
  chatHistories[currentChatId].push({ role: "user" as const, content: prompt });
  
  // Call OpenAI API
  const response = await openai.chat.completions.create({
    model: "o3", // This should be a valid OpenAI model name
    messages: chatHistories[currentChatId]
  });
  
  // Extract assistant message
  const assistantMessage = response.choices[0].message.content;
  
  // Add assistant response to history
  if (assistantMessage) {
    chatHistories[currentChatId].push({ 
      role: "assistant" as const, 
      content: assistantMessage 
    });
  }
  
  return {
    chatId: currentChatId,
    content: assistantMessage || "No response generated"
  };
}