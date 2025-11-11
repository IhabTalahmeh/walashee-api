import { Injectable } from "@nestjs/common";
import { UUID } from "crypto";
import { compressImage } from "../utils/utils";
import { AwsService } from "src/modules/aws/services/aws.service";



@Injectable()
export class AWSHelper {
  constructor(
    private awsService: AwsService,
  ) { }


  async uploadAvatar(path: string, imageFile: Buffer, fileName: string) {

    const small = await compressImage(imageFile, 128, 80);
    const medium = await compressImage(imageFile, 512, 80);
    const large = await compressImage(imageFile, 1024, 80);
    const xlarge = await compressImage(imageFile, 2048, 80);

    await this.awsService.uploadFile(`${path}/small_${fileName}`, small);
    await this.awsService.uploadFile(`${path}/medium_${fileName}`, medium);
    await this.awsService.uploadFile(`${path}/large_${fileName}`, large);
    await this.awsService.uploadFile(`${path}/xlarge_${fileName}`, xlarge);
    await this.awsService.uploadFile(`${path}/original_${fileName}`, imageFile);

  }
}