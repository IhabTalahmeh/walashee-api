import { Module } from '@nestjs/common';
import { CloudfrontService } from './services/cloudfront.service';
import { AwsService } from './services/aws.service';

@Module({
    providers: [
        CloudfrontService,
        AwsService,
    ],
    exports: [
        CloudfrontService,
        AwsService,
    ]
})
export class AwsModule { }
