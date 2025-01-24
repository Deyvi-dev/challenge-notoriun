import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { AuthModule } from './auth/auth.module';
import { HashingModule } from './hashing/hashing.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        secure: process.env.EMAIL_SECURE === 'true' || false,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        port: process.env.EMAIL_PORT as unknown as number,
      },
      template: {
        dir: join(__dirname, 'templates', 'emails'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      migrations: [
        join(__dirname, 'src', 'database', 'migrations', '*-migration.{ts,js}'),
      ],
      autoLoadEntities: true,
      synchronize: false,
    }),
    UsersModule,
    AuthModule,
    HashingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
