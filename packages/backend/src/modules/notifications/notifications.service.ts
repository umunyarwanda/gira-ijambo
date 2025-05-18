import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { Repository } from 'typeorm';
import { EEmailStatus } from '~/shared/enums/EEmailStatus.enum';
import { MailerService } from '@nestjs-modules/mailer';
import { GIRA_IJAMBO_EMAIL } from '~/shared/variables/urls';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private mailerService: MailerService,
  ) {}

  create(createNotificationDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) 
  async sendPendingEmails() {
    const getPendingEmail = await this.notificationRepository.findOne({
      where: {status: EEmailStatus.PENDING
    }});

    if (getPendingEmail) {
      getPendingEmail.status = EEmailStatus.RUNNING;
      await this.notificationRepository.save(getPendingEmail);

      await this.mailerService.sendMail({
        to: getPendingEmail.to,
        from: GIRA_IJAMBO_EMAIL,
        subject: getPendingEmail.subject,
        text: getPendingEmail.emailText,
        html: getPendingEmail.emailContent
      }).then((success) => {
        getPendingEmail.status = EEmailStatus.SENT;
        this.notificationRepository.save(getPendingEmail);
      }).catch((err) => {
        getPendingEmail.status = EEmailStatus.FAILED;
        this.notificationRepository.save(getPendingEmail);
      });
    }
  }
}
