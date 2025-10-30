import { registerAs } from "@nestjs/config";

export default registerAs('aws', () => ({
    region: process.env.AWS_REGION ?? '',
    key: process.env.AWS_ACCESS_KEY_ID ?? '',
    secret: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    bucket: process.env.AWS_S3_BUCKET_NAME ?? '',
}));
