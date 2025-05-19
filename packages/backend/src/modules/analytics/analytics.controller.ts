import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AnalyticsApiUrl } from '~/shared/variables/urls';
import { AnalyticsService } from './analytics.service';
import { RolesGuard } from '../auth/guards/RolesGuard.guard';
import { PERMISSION_NAME_KEY } from '~/shared/constants/auth';
import { permissions } from '~/shared/constants/auth/permissions.constants';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Analytics')
@Controller(AnalyticsApiUrl.CONTROLLER)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get(AnalyticsApiUrl.GET_ANALYTICS)
  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.getAnalytics.roles,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get analytics' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getAnalytics() {
    return this.analyticsService.getAnalytics();
  }

  @Get(AnalyticsApiUrl.GET_AI_INSIGHTS)
  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.getAnalytics.roles,
  })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get ai insights' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  getAiInsights() {
    return this.analyticsService.getAiInsights();
  }
}
