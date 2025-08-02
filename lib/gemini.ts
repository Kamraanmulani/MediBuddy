import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key from environment variables
const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Doctor persona prompt
const DOCTOR_SYSTEM_PROMPT = `
You are Dr. MediBot, a highly qualified virtual healthcare assistant with expertise in general medicine.
Your role is to provide helpful medical information, general health advice, and assist users with understanding medical concepts.

Guidelines:
- Respond in a professional, empathetic, and clear manner.
- Provide evidence-based information.
- Clarify that you're an AI assistant, not a real doctor, when appropriate.
- Emphasize that your advice doesn't replace professional medical consultation.
- Do not make definitive diagnoses or prescribe specific treatments.
- For serious medical concerns, always advise consulting a healthcare professional.
- Keep responses concise and easy to understand.
- generate response in 100 words or less.

Remember to maintain a calm, reassuring tone while being informative and helpful.
`;

// Create a Gemini 2.0 Flash model chat instance with doctor persona
export async function createDoctorChat() {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: DOCTOR_SYSTEM_PROMPT,
    });
    
    return model.startChat({
      history: [],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 0.8,
        maxOutputTokens: 500,
      },
    });
  } catch (error) {
    console.error("Error creating chat session:", error);
    throw new Error("Failed to initialize chat with Gemini API. Please check your API key.");
  }
}

// Function to generate a response from the doctor chatbot
export async function getDoctorResponse(userMessage: string, chatSession?: any) {
  try {
    if (!chatSession) {
      chatSession = await createDoctorChat();
    }
    
    try {
      const result = await chatSession.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();
      
      return {
        text,
        chatSession
      };
    } catch (apiError: any) {
      console.error("API Error in getDoctorResponse:", apiError);
      
      // If the API key is invalid or there's an authentication issue
      const errorMessage = apiError?.toString() || "";
      if (errorMessage.includes("403") || 
          errorMessage.includes("unregistered") ||
          errorMessage.includes("identity")) {
        return {
          text: "API authentication error. Please check your Gemini API key.",
          chatSession
        };
      }
      
      // For other API errors
      return {
        text: "I'm sorry, I encountered an error processing your request. Please try again later.",
        chatSession
      };
    }
  } catch (error) {
    console.error("Error in getDoctorResponse:", error);
    return {
      text: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
      chatSession
    };
  }
} 