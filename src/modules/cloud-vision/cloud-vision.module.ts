import { Module } from '@nestjs/common';
import { CloudVisionController } from './controllers/cloud-vision.controller';
import { CloudVisionService } from './services/cloud-vision-service';

@Module({
  controllers: [CloudVisionController],
  providers: [
    CloudVisionService
  ],
  exports: [
    CloudVisionService,
  ]
})
export class CloudVisionModule {}
