import { Injectable } from '@nestjs/common';
import { ImageAnnotatorClient } from '@google-cloud/vision';

@Injectable()
export class CloudVisionService {
  private client = new ImageAnnotatorClient({
    keyFilename: 'cloud-vision-api-key.json',
  });

  async extractTextFromMultipleImages(files: Buffer[]) {
    const results: any[] = [];

    for (const file of files) {
      const [result] = await this.client.textDetection({ image: { content: file } });
      const text = result.textAnnotations?.[0]?.description || '';
      results.push({
        filename: new Date().toString(),
        extractedText: text
      });
    }

    // Optional: merge all text into one for GPT prompt
    const mergedText = results.map(r => r.extractedText).join('\n');

    return {
      perImageResults: results,
      mergedTextForAnalysis: mergedText
    };
  }

  async detectLabelsFromMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    const allLabels: string[] = [];

    for (const file of files) {
      const [result] = await this.client.labelDetection({
        image: { content: file.buffer },
      });

      const labels = result.labelAnnotations
        ?.filter(label => label.score && label.score >= 0.7)
        .map(label => label.description?.toLowerCase() ?? '');

      if (labels?.length) {
        allLabels.push(...labels);
      }
    }

    return Array.from(new Set(allLabels));
  }
}
