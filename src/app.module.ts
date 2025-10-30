import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import database from './../config/database.config';
import googleOauthConfig from 'config/google-oauth.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import jwtConfig from 'config/jwt.config';
import { EntityLookupModule } from './modules/entity-lookup/entity-lookup.module';
import { AwsModule } from './modules/aws/aws.module';
import awsConfig from 'config/aws.config';
import openai from 'config/openai.config';

const configurations = [
  database,
  googleOauthConfig,
  jwtConfig,
  awsConfig,
  openai
];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: configurations,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        autoLoadEntities: true,
        synchronize: false,
        timezone: 'Z',
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    JwtModule,
    EntityLookupModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware);
  }
}