import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ListObjectsV2Command, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private readonly s3Client: S3Client;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('aws.region'),
    });
  }

  async uploadFile(path: string, file: Buffer) {
    try {
      const result = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.get('aws.bucket'),
          Key: path,
          Body: file
        })
      );
      if (result.$metadata.httpStatusCode == 200) {
        return { message: "file uploaded successfully" };
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async listFilesInFolder(bucket: string, folderPrefix: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: folderPrefix.endsWith('/') ? folderPrefix : `${folderPrefix}/`,
    });

    const response = await this.s3Client.send(command);

    if (!response.Contents) return [];

    return response.Contents
      .filter(item => item.Key !== folderPrefix)
      .map(item => item.Key) as string[];
  }

}
