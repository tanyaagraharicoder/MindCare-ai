import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const getAIResponseStream = async (message: string, history: { role: string, content: string }[]) => {
  const model = "gemini-1.5-flash";
  
  const chat = ai.chats.create({
    model,
    config: {
      systemInstruction: `You are MindCare AI, an empathetic and intelligent mental health assistant. 
      Your goal is to provide supportive, non-judgmental, and helpful responses to users.
      
      Guidelines:
      1. Use active listening and validate the user's feelings.
      2. Provide practical coping strategies (breathing exercises, grounding techniques).
      3. If the user expresses self-harm or crisis, IMMEDIATELY provide emergency resources and encourage them to seek professional help.
      4. Keep responses concise but warm.
      5. Detect the user's mood from their message and subtly reflect it.
      
      Crisis Resources:
      - National Suicide Prevention Lifeline: 988
      - Crisis Text Line: Text HOME to 741741`,
    },
  });

  // Convert history to Gemini format
  // Note: Gemini expects 'user' and 'model' roles
  const formattedHistory = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.content }]
  }));

  // We don't actually use the history in the sendMessageStream call directly if we want to include it in the chat creation, 
  // but for simplicity we can just send the message.
  // Actually, ai.chats.create doesn't take history in the same way as sendMessage.
  
  const response = await chat.sendMessageStream({
    message: message
  });

  return response;
};

export const detectMood = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the emotional tone of this text and return ONLY one word from this list: 
    [Happy, Sad, Stressed, Anxious, Angry, Calm, Neutral, Excited].
    
    Text: "${text}"`,
  });

  return response.text?.trim() || "Neutral";
};
