import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeProperty = async (address: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Extract public property data for ${address} for a general contractor site assessment. 
      Provide details including beds, baths, sqft, year built, foundation type, estimated value, flood zone, tax assessment history, listing status, layout description, and professional reasoning.
      
      For foundation type, it must be one of: "Basement", "Crawl Space", "Slab", "Unknown".
      
      In the reasoning section, provide "Contractor Notes" focusing on site access, potential structural age concerns, and foundation implications for renovation or repair work.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foundationType: {
              type: Type.STRING,
              enum: ['Slab', 'Crawl Space', 'Basement', 'Unknown'],
              description: "The type of foundation."
            },
            yearBuilt: { type: Type.STRING, description: "Year the property was built." },
            sqFt: { type: Type.STRING, description: "Square footage of the property." },
            beds: { type: Type.STRING, description: "Number of bedrooms." },
            baths: { type: Type.STRING, description: "Number of bathrooms." },
            estimatedValue: { type: Type.STRING, description: "Estimated value of the property." },
            floodZone: { type: Type.STRING, description: "Flood zone classification." },
            taxHistory: { type: Type.STRING, description: "Brief summary of recent tax assessment history." },
            listingStatus: { type: Type.STRING, description: "Current listing status (e.g. Active, Sold, Off Market)." },
            layoutDescription: { type: Type.STRING, description: "Brief description of the layout." },
            reasoning: { type: Type.STRING, description: "Contractor notes on site conditions, foundation implications, and age-related concerns." },
          },
          required: ['foundationType', 'yearBuilt', 'sqFt', 'beds', 'baths', 'estimatedValue', 'floodZone', 'taxHistory', 'listingStatus', 'layoutDescription', 'reasoning'],
        }
      }
    });

    const data = JSON.parse(response.text || "{}");

    const groundingSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => {
        if (chunk.web) {
          return { uri: chunk.web.uri, title: chunk.web.title };
        }
        return null;
      })
      .filter((item: any) => item !== null) || [];

    // Deduplicate sources based on uri
    const uniqueSources: Array<{ uri: string; title: string }> = [];
    const seen = new Set();
    for(const source of groundingSources) {
        if(!seen.has(source.uri)){
            seen.add(source.uri);
            uniqueSources.push(source);
        }
    }

    return {
      foundationType: (data.foundationType as any) || 'Unknown',
      yearBuilt: data.yearBuilt || '',
      sqFt: data.sqFt || '',
      beds: data.beds || '',
      baths: data.baths || '',
      estimatedValue: data.estimatedValue || '',
      floodZone: data.floodZone || '',
      taxHistory: data.taxHistory || 'Not available',
      listingStatus: data.listingStatus || 'Unknown',
      layoutDescription: data.layoutDescription || '',
      reasoning: data.reasoning || '',
      mapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
      groundingSources: uniqueSources,
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};