import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException, Get } from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { CloudVisionService } from "../services/cloud-vision-service";


@Controller('cloud-vision')
export class CloudVisionController {

  constructor(private readonly visionService: CloudVisionService) {}

  @Post('analyze')
  @UseInterceptors(FilesInterceptor('files'))
  async analyzeImages(@UploadedFiles() files: Buffer[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    return await this.visionService.extractTextFromMultipleImages(files);
  }
}