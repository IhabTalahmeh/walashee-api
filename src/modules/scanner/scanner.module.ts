import { Module } from '@nestjs/common';
import { ScannerService } from './services/scanner.service';
import { ScannerController } from './controllers/scanner.controller';
import { OpenaiModule } from '../openai/openai.module';

@Module({
    imports: [
        OpenaiModule,
    ],
    controllers: [
        ScannerController,
    ],
    providers: [
        ScannerService,
    ]
})
export class ScannerModule { }
