import { Module } from '@nestjs/common';
import { OpenaiService } from './services/openai.service';
import { CloudVisionModule } from '../cloud-vision/cloud-vision.module';

@Module({
  imports: [
    CloudVisionModule,
  ],
  providers: [
    OpenaiService,
  ],
  exports: [
    OpenaiService,
  ]
})
export class OpenaiModule { }
