import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { InjectEntityManager, TypeOrmModule } from '@nestjs/typeorm';
import DatabaseConfig from './shared/configs/db/typeorm.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { EntityManager } from 'typeorm';
import { permissions } from './shared/constants/auth/permissions.constants';
import { EUserRole } from './shared/enums/EUserRole.enum';
import { EPermissionType } from './shared/enums/EPermissionType.enum';
import { User } from './modules/users/entities/user.entity';
import { AgenciesModule } from './modules/agencies/agencies.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    TypeOrmModule.forRoot(DatabaseConfig),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true
    }),
    EventEmitterModule.forRoot({
      global: true
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'husseinadji06@gmail.com',
          pass: 'bqbiobydexxubtjs',
        },
      },
      defaults: {
        from: '"No Reply" <husseinadji06@gmail.com>',
      },
      preview: true,
      // template: {
      //   dir: process.cwd() + '/template/',
      //   adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
      //   options: {
      //     strict: true,
      //   },
      // },
    }),
    NotificationsModule,
    AgenciesModule,
    CategoriesModule,
    ComplaintsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor(@InjectEntityManager() private entityManager: EntityManager) { }

  /**
   * Seed permissions on application bootstrap
   * @returns
   * @memberof AppModule
   */
  async onModuleInit() {

  }

}
