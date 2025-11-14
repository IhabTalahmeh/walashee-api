import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
import { compressImage } from 'src/common/utils/utils';
import { CloudVisionService } from 'src/modules/cloud-vision/services/cloud-vision-service';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

@Injectable()
export class OpenaiService {

  constructor(
    private cloudVisionService: CloudVisionService,
  ) { }

  async scanID(file: Buffer) {

    const ocrText = await this.cloudVisionService.extractTextFromMultipleImages([file]);

    const imagesContent = [file].map((file) => ({
      type: 'image_url',
      image_url: {
        url: `data:image/png;base64,${Buffer.from(file.buffer).toString('base64')}`,
        detail: 'high',
      }
    }));

    const completion = await openai.chat.completions.create({
      model: "chatgpt-4o-latest",
      temperature: 0,
      max_tokens: 3000,
      messages: [
        {
          role: 'system',
          content: [
            {
              type: 'text',
              text: `Extract the following fields from the provided ID or passport image and return only a JSON object with no additional text:
*** Arabic has priority ***
{
  "fullName": "",      // first father grandfather family
  "dateOfBirth": "",   // format: yyyy-mm-dd
  "number": "",        // ID or passport number
  "address": ""        // place of issue or place of birth
}

Return only the JSON object with empty strings filled in. No comments, no explanations, no extra fields.

After you finish:
- Remove all comments from the json response.
- Remove everything outside the json object, as your response will be parsed.

ocrText: ${ocrText}
`
            }
          ]
        },
        {
          role: 'user',
          content: [
            ...imagesContent as any
          ]
        }
      ],
    });

    const content: any = completion.choices[0].message.content;

    try {
      return content
    } catch (err) {
      throw new Error(`Failed to parse OpenAI response: ${err.message}`);
    }

  }

}

