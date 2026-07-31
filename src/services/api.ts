// @ts-ignore
import { API_BASE_URL } from "../utils/constants";
import { storage } from "./storage";
import axios from "axios";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await storage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const HF_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const HF_MODEL_URL = "https://router.huggingface.co/v1/chat/completions";

export const authApi = {
  login: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      data: {
        user: { id: "1", email, name: "John Doe" },
        token: "mock-jwt-token-" + Date.now(),
      },
    };
  },

  signup: async (email: string, password: string, name: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      data: {
        user: { id: "1", email, name },
        token: "mock-jwt-token-" + Date.now(),
      },
    };
  },
};

export const chatApi = {
  sendMessage: async (message: string) => {
    try {
      console.log("🔄 Sending message to Hugging Face Chat Completions API...");

      const body = {
        model: "meta-llama/Llama-3.1-8B-Instruct",
        messages: [
          {
            role: "system",
            content: `
      You are a cooking-ingredients extraction AI.

      🔴 Your ONLY job:
      Given ANY dish name (like bhindi, dal, dosa, paneer), return the **actual raw ingredients + spices** needed to cook that dish.

      ⚠️ STRICT RULES:
      - Do NOT return synonyms (e.g., "okra", "lady fingers")  
      - Do NOT return cuisines (e.g., "Indian")  
      - Do NOT return nutritional info  
      - Do NOT return preparation steps  
      - Do NOT return formatting or text outside JSON  

      ✔️ ALWAYS return ingredients used to cook it:  
      vegetables, oil, masala, salt, chilli, haldi, jeera, dhania powder, ginger, garlic, etc.

      🟢 NEW RULE:
      - For every ingredient, include its Hindi equivalent in brackets.
      - Example: "turmeric (हल्दी)", "cumin seeds (जीरा)", "red chilli powder (लाल मिर्च)"
      - If no clear Hindi equivalent exists, just keep the English name.

      ✔️ ALWAYS respond ONLY in valid JSON:
      {
        "ingredients": [string]
      }
      `,
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      };

      const response = await axios.post(HF_MODEL_URL, body, {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Raw Hugging Face Response:", response.data);

      const rawText = response.data?.choices?.[0]?.message?.content || "";
      let parsedIngredients: string[] = [];

      try {
        const parsedJson = JSON.parse(rawText);
        parsedIngredients = parsedJson.ingredients || [];
      } catch {
        console.warn("⚠️ Response was not valid JSON:", rawText);
      }
      const normalizedIngredients = parsedIngredients.map((name, index) => ({
        id: index.toString(),
        name,
        selected: true,
        price: Math.floor(Math.random() * 50) + 10,
        notes: "",
      }));
      const parsedResponse = {
        response: rawText.trim() || "No response received.",
        ingredients: normalizedIngredients,
      };

      console.log("✅ Parsed Response:", parsedResponse);
      return { data: parsedResponse };
    } catch (error: any) {
      console.error(
        "❌ Hugging Face API Error:",
        error.response?.data || error.message
      );

      return {
        data: {
          response:
            "Sorry, I'm having trouble connecting to Hugging Face right now.",
          ingredients: [],
          error: error.message,
        },
      };
    }
  },
};

export default api;
