import { Injectable } from "@nestjs/common";
import { OpenaiService } from "src/modules/openai/services/openai.service";



@Injectable()
export class ScannerService {

    constructor(
        private openAIService: OpenaiService,
    ) { }

    async scanID(file: Buffer) {
        return await this.openAIService.scanID(file)
    }
}