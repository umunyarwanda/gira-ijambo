import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AnalyticsApiUrl } from '~/shared/variables/urls';
import { Complaint } from '../complaints/entities/complaint.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { EComplaintStatus } from '~/shared/enums/EComplainStatus.enum';
import { IGetAnalyticsResDto } from '~/shared/interfaces/analytics/IAnalyticsRes.dto';
import { startOfDay, endOfDay, subDays } from 'date-fns';
import { Category } from '../categories/entities/category.entity';
import axios from 'axios';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Complaint)
    private readonly complaintsRepository: Repository<Complaint>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) { }

  async getAnalytics(): Promise<IGetAnalyticsResDto> {
    try {
      return await this.getAnalyticsData();
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAiInsights() {
    try {
      const analyticsData = await this.getAnalyticsData();

      // Make a request to the AI API
      const aiAPI = process.env.GROQ_API_ENDPOINT;
      const aiAPIKey = process.env.GROQ_API_KEY;
      const prompt = 'You are an AI analytics assistant for a Citizen Complaint Management System. Provide a concise analysis with these sections: 1) **Key Metrics** (2-3 most important numbers), 2) **Critical Issues** (top 2 issues in **bold**), 3) **Trend Analysis** (one key pattern), 4) **Recommendations** (2 specific actions). Use markdown formatting with **bold** for important numbers and metrics. Keep it focused but informative:';

      const payload = {
        model: 'llama3-8b-8192',
        messages: [{
          role: 'user',
          content: `${prompt} ${JSON.stringify(analyticsData)}`
        }],
      }

      const response = await axios.post(aiAPI, payload, {
        headers: {
          'Authorization': `Bearer ${aiAPIKey}`,
          'Content-Type': 'application/json'
        }
      })

      return response.data.choices[0].message.content;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private async getAnalyticsData() {
    const today = new Date();
    // 1. Total complaints
    const totalComplaints = await this.complaintsRepository.count();
    // 2. Resolved complaints
    const resolvedComplaints = await this.complaintsRepository.count({
      where: { status: EComplaintStatus.RESOLVED }
    });
    // 3. Pending complaints
    const pendingComplaints = await this.complaintsRepository.count({
      where: { status: EComplaintStatus.PENDING }
    });
    // 4. Complaints made today
    const complaintsMadeToday = await this.complaintsRepository.count({
      where: {
        createdAt: Between(startOfDay(today), endOfDay(today))
      }
    });
    // 5. Complaints by days (last 7 days)
    const days = 7;
    const labels: string[] = [];
    const data: number[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const day = subDays(today, i);
      const count = await this.complaintsRepository.count({
        where: {
          createdAt: Between(startOfDay(day), endOfDay(day))
        }
      });
      labels.push(day.toLocaleDateString());
      data.push(count);
    }

    // 6. Complaints by category
    const categoryResults = await this.complaintsRepository
      .createQueryBuilder('complaint')
      .leftJoinAndSelect('complaint.category', 'category')
      .select('category.name', 'categoryName')
      .addSelect('COUNT(complaint.id)', 'count')
      .groupBy('category.name')
      .getRawMany();

    const categoryLabels = categoryResults.map(result => result.categoryName || 'Uncategorized');
    const categoryData = categoryResults.map(result => parseInt(result.count));

    const reponse: IGetAnalyticsResDto = {
      totalComplaints,
      resolvedComplaints,
      pendingComplaints,
      complaintsMadeToday,
      complaintsByDays: {
        labels,
        datasets: [
          {
            label: 'Complaints by Day',
            data
          }
        ]
      },
      complaintsByCategory: {
        labels: categoryLabels,
        datasets: [{
          data: categoryData
        }]
      }
    }

    return reponse;
  }
}

