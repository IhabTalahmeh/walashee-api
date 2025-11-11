import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class CloudfrontService {
  async _getSignedUrl(filePath: string) {
    return getSignedUrl({
      url: `https://d26t4jubdfqdzf.cloudfront.net/${filePath}`,
      dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID as string,
      privateKey: process.env.CLOUDFRONT_PRIVATE_KEY as string,
    });
  }
}