import { Injectable } from "@nestjs/common";
import { UUID } from "crypto";
import { compressImage } from "../utils/utils";
import { AwsService } from "src/modules/aws/services/aws.service";



@Injectable()
export class AWSHelper {
  constructor(
    private awsService: AwsService,
  ) { }


  async uploadTeamAvatar(teamId: UUID, imageFile: Buffer, fileName: string) {

    const small = await compressImage(imageFile, 128, 80);
    const medium = await compressImage(imageFile, 512, 80);
    const large = await compressImage(imageFile, 1024, 80);
    const xlarge = await compressImage(imageFile, 2048, 80);

    await this.awsService.uploadFile(`teams/${teamId}/avatar/small_${fileName}`, small);
    await this.awsService.uploadFile(`teams/${teamId}/avatar/medium_${fileName}`, medium);
    await this.awsService.uploadFile(`teams/${teamId}/avatar/large_${fileName}`, large);
    await this.awsService.uploadFile(`teams/${teamId}/avatar/xlarge_${fileName}`, xlarge);
    await this.awsService.uploadFile(`teams/${teamId}/avatar/original_${fileName}`, imageFile);

  }
}