import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Missing Gemini API key');
    }

    const { message, context, history } = await request.json();

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro-latest" 
    });


    const formattedHistory = (history || []).map(item => ({
      role: item.role === 'model' ? 'model' : 'user',
      parts: [{ text: item.content }]
    }));


    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: context }]
        },
        {
          role: "model",
          parts: [{ text: "Understood! I'll assist with travel queries professionally." }]
        },
        ...formattedHistory
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.5,
      },
    });

  
    const result = await chat.sendMessage(message);
    const response = await result.response;
    
    if (!response) {
      throw new Error('Empty response from Gemini API');
    }

    const reply = response.text();
    return Response.json({ reply });

  } catch (error) {
    console.error('Detailed Gemini API error:', error);
    
    return Response.json(
      { reply: "Our travel assistant is currently unavailable. Please try again later or contact support." },
      { status: 500 }
    );
  }
}