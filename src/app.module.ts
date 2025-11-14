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
import { LookupsModule } from './modules/lookups/lookups.module';
import openai from 'config/openai.config';
import awsConfig from 'config/aws.config';
import { UsersModule } from './modules/users/users.module';
import { AgentModule } from './modules/agent/agent.module';
import fcmConfig from 'config/fcm.config';
import { FcmModule } from './modules/fcm/fcm.module';
import { I18nModule, QueryResolver, AcceptLanguageResolver, HeaderResolver } from 'nestjs-i18n';
import * as path from 'path';
import { NotificationModule } from './modules/notification/notification.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ScannerModule } from './modules/scanner/scanner.module';

const configurations = [
  database,
  googleOauthConfig,
  jwtConfig,
  awsConfig,
  openai,
  fcmConfig,
];

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '../i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
    }),
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
    LookupsModule,
    UsersModule,
    AgentModule,
    FcmModule,
    NotificationModule,
    CustomerModule,
    ScannerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware);
  }
}