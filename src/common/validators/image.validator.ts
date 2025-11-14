import { BadRequestException, FileValidator, PipeTransform } from "@nestjs/common";

class ImageFileValidator extends FileValidator {
  constructor() {
    super({});
  }

  isValid(file: Express.Multer.File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return allowedTypes.includes(file.mimetype);
  }

  buildErrorMessage(): string {
    return 'Only JPEG, PNG, or WEBP images are allowed';
  }
}

/**
 * Validate a single uploaded image.
 */
export class ImageValidationPipe implements PipeTransform {
  private validator = new ImageFileValidator();

  constructor(private readonly required: boolean = false) {}

  transform(file: Express.Multer.File) {
    if (!file && this.required) {
      throw new BadRequestException('File is required');
    }

    if (file && !this.validator.isValid(file)) {
      throw new BadRequestException(this.validator.buildErrorMessage());
    }

    return file;
  }
}

/**
 * Validate multiple uploaded images.
 */
export class ImagesValidationPipe implements PipeTransform {
  private validator = new ImageFileValidator();

  transform(files: Express.Multer.File[]) {
    if (!Array.isArray(files)) {
      throw new BadRequestException('Files are required');
    }

    for (const file of files) {
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
