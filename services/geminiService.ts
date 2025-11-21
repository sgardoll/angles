import { GoogleGenAI, Type } from "@google/genai";
import { AngleResponse, RedditPost, AngleDirection } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert social media strategist specializing in Reddit community growth. 
Your goal is to take a video transcript (and optional visual context) and repurpose it into highly engaging, community-specific Reddit posts.

RULES:
1. **The 9:1 Rule**: Content must be 90% value-add for the reader, 10% promotion. Avoid overt marketing speak.
2. **Community Fit**: Adapt the tone, structure, and slang to fit the specific subreddit targeting.
3. **Angles**: Identify unique "angles" or perspectives from the content. One video can spawn a debate post for r/unpopularopinion, a technical deep dive for r/webdev, and a founder story for r/entrepreneur.
4. **Formatting**: Use Markdown (bolding, lists) appropriately as Reddit users prefer.

OUTPUT:
Return a JSON object containing an array of 'angles'.
`;

export const generateAngles = async (
  transcript: string, 
  mediaFile: File | null,
  refineOptions?: { direction: AngleDirection, existingSubreddits: string[] }
): Promise<RedditPost[]> => {
  
  const parts: any[] = [];

  // Add Media if present (Image or Video)
  if (mediaFile) {
    const base64Data = await fileToGenerativePart(mediaFile);
    parts.push(base64Data);
  }

  // Construct prompt based on whether this is a fresh analysis or a refinement
  let prompt = `Here is the transcript of the video content:\n\n${transcript}\n\n`;

  if (refineOptions) {
    const { direction, existingSubreddits } = refineOptions;
    const existingList = existingSubreddits.join(', ');
    
    prompt += `IMPORTANT: You have already generated posts for these subreddits: ${existingList}. DO NOT use these again. Find NEW communities.\n\n`;
    
    if (direction === 'niche') {
        prompt += `TASK: The user wants "More Obvious" / "Contracted" angles.
        - Focus on highly specific, technical, or exact-match communities.
        - Drill down into specific tools, frameworks, languages, or sub-problems discussed.
        - Example: If talking about generic coding, target r/FlutterDev, r/reactjs, or r/css instead of r/webdev.
        - Generate 3 new distinct posts that are DEEP DIVES.`;
    } else {
        prompt += `TASK: The user wants "Less Obvious" / "Expanded" angles.
        - Focus on broader, tangential, or "vibe-based" communities.
        - Look for angles related to career advice, philosophy, mental health, future trends, or abstract concepts.
        - Example: If talking about coding, target r/vibecoding, r/digitalnomad, r/ADHDProgrammers, or r/futurology.
        - Generate 3 new distinct posts that are BIG PICTURE.`;
    }
  } else {
    prompt += `Based on this, generate 3-4 distinct Reddit posts for different suitable subreddits.`;
  }

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            angles: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  subreddit: { type: Type.STRING, description: "Target subreddit (e.g. r/webdev)" },
                  title: { type: Type.STRING, description: "Catchy, native-feeling post title" },
                  body: { type: Type.STRING, description: "The full post content in Markdown" },
                  flair: { type: Type.STRING, description: "Suggested post flair if applicable" },
                  angleExplanation: { type: Type.STRING, description: "Brief explanation of the strategy used here" },
                  selfPromotionRisk: { type: Type.STRING, enum: ["Low", "Medium", "High"] }
                },
                required: ["subreddit", "title", "body", "angleExplanation", "selfPromotionRisk"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const data = JSON.parse(text) as AngleResponse;
    return data.angles;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

// Helper to convert File to Generative Part
async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}