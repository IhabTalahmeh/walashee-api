import { Controller, Get, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ScannerService } from "../services/scanner.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImageValidationPipe } from "src/common/validators/image.validator";



@Controller('scanner')
export class ScannerController {

    constructor(
        private scannerService: ScannerService,
    ) { }

    @Get('id-scanner')
    @UseInterceptors(FileInterceptor('file'))
    async scanID(
        @UploadedFile(new ImageValidationPipe(true)) file: Express.Multer.File,
    ) {
        return this.scannerService.scanID(file.buffer)
    }
}