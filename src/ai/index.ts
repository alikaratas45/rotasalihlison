import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

// Explicitly pass the API key from the environment variable.
// This ensures that the Genkit plugin is configured with the necessary credentials.
// The GEMINI_API_KEY is expected to be set in the server environment.
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});
