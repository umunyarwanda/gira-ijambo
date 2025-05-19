import { Module } from '@nestjs/common';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Complaint } from '../complaints/entities/complaint.entity';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Agency } from '../agencies/entities/agency.entity';
import { Response } from '../complaints/entities/responses.entity';
import { ComplaintsModule } from '../complaints/complaints.module';

@Module({
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  imports: [
    TypeOrmModule.forFeature([Complaint, User, Agency, Category, Response]),
    ComplaintsModule
  ],
})
export class AnalyticsModule {}
