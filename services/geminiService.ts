import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const getStyleAdvice = async (userQuery: string, currentProducts: Product[]): Promise<{ recommendations: { productId: string, reason: string }[] }> => {
  try {
    const model = "gemini-2.5-flash";
    
    const productContext = currentProducts.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      tags: p.tags,
      price: p.price,
      description: p.description
    }));

    const prompt = `
      You are a high-end jewelry stylist for "NRK Aura Luxury Bangles". 
      The user is asking: "${userQuery}".
      
      Here is our live catalog: ${JSON.stringify(productContext)}.
      
      Please recommend 1 to 3 products that best fit the user's request.
      Explain why you chose each one in a sophisticated, sales-oriented tone suitable for a luxury brand.
      The price is in Indian Rupees (INR).
      
      Return JSON only.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productId: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return { recommendations: [] };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { recommendations: [] };
  }
};

export const getProductRomanceCopy = async (product: Product): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a short, poetic, and luxurious 2-sentence description for this bangle: ${product.name} from NRK Aura. It is made of ${product.category} and costs ₹${product.price}. Description context: ${product.description}.`
        });
        return response.text || product.description;
    } catch (e) {
        return product.description;
    }
}

export const generateProductDescription = async (name: string, tags: string[]): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a luxurious 1-sentence product description for a bangle named "${name}" by NRK Aura with tags: ${tags.join(', ')}.`
        });
        return response.text || "A beautiful bangle.";
    } catch (e) {
        return "A masterpiece of craftsmanship.";
    }
}