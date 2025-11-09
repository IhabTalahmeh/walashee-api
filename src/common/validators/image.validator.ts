import { BadRequestException, FileValidator, Injectable, PipeTransform } from "@nestjs/common";

class ImageFileValidator extends FileValidator {
  constructor() {
    super({});
  }

  isValid(file: Express.Multer.File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return allowedTypes.includes(file.mimetype);
  }

  buildErrorMessage(): string {
    return 'Only JPEG or PNG or WEBP images are allowed';
  }
}

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  private validator = new ImageFileValidator();

  transform(file: Express.Multer.File) {
    if (!file) {
      // throw new BadRequestException('File is required');
    }

    if(file){
      if (!this.validator.isValid(file)) {
        throw new BadRequestException(this.validator.buildErrorMessage());
      }
    }
    
    return file;
  }
}

@Injectable()
export class ImagesValidationPipe implements PipeTransform {
  private validator = new ImageFileValidator();

  transform(files: Express.Multer.File[]) {

    for (let file of files) {
      if (!file) {
        throw new BadRequestException('File is required');
      }

      if (!this.validator.isValid(file)) {
        throw new BadRequestException(this.validator.buildErrorMessage());
      }
    }
    return files;
  }
}