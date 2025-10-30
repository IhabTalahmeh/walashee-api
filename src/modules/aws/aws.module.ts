import { Module } from '@nestjs/common';
import { CloudfrontService } from './services/cloudfront.service';

@Module({
    providers: [CloudfrontService],
    exports: [
        CloudfrontService
    ]
})
export class AwsModule { }
