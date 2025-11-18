'use server';

/**
 * @fileOverview A text-to-speech AI flow for generating audio guides.
 *
 * - generateAudioGuide - A function that handles the audio generation process.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import {googleAI} from '@genkit-ai/google-genai';

const AudioGuideInputSchema = z.object({
  textToSpeak: z.string().describe('The text to be converted to speech.'),
});

const AudioGuideOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe('The generated audio as a data URI in WAV format.'),
});

export type AudioGuideInput = z.infer<typeof AudioGuideInputSchema>;
export type AudioGuideOutput = z.infer<typeof AudioGuideOutputSchema>;

export async function generateAudioGuide(
  input: AudioGuideInput
): Promise<AudioGuideOutput> {
  const result = await audioGuideFlow(input);
  return result;
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const audioGuideFlow = ai.defineFlow(
  {
    name: 'audioGuideFlow',
    inputSchema: AudioGuideInputSchema,
    outputSchema: AudioGuideOutputSchema,
  },
  async ({textToSpeak}) => {
    const {media} = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {voiceName: 'Alloy'}, // A pleasant male voice
          },
        },
      },
      prompt: textToSpeak,
    });

    if (!media) {
      throw new Error('No media returned from the text-to-speech model.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
