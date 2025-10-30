import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  audience: process.env.JWT_AUDIENCE || 'urn:walashee:api:local',
  issuer: process.env.JWT_ISSUER || 'aaaa-bbbb-bbbb-bbbb-bbbb',
  secret: process.env.JWT_SECRET || 'walashee#jwt#auth',
  expiresIn: process.env.JWT_EXP || 1209600000, // Default is 2 weeks, value is in milliseconds.
}));