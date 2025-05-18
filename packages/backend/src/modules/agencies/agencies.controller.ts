import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { AgenciesService } from './agencies.service';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { AgencyApiUrl } from '~/shared/variables/urls';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PERMISSION_NAME_KEY } from '~/shared/constants/auth';
import { RolesGuard } from '../auth/guards/RolesGuard.guard';
import { permissions } from '~/shared/constants/auth/permissions.constants';

@ApiTags('Agencies')
@Controller(AgencyApiUrl.CONTROLLER)
export class AgenciesController {
  constructor(private readonly agenciesService: AgenciesService) {}

  @Post(AgencyApiUrl.CREATE_AGENCY)
  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.createAgency.roles,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Body() createAgencyDto: CreateAgencyDto) {
    return this.agenciesService.create(createAgencyDto);
  }

  @Get(AgencyApiUrl.GET_AGENCIES)
  findAll() {
    return this.agenciesService.findAll();
  }

  @Get(AgencyApiUrl.GET_AGENCY + '/:id')
  findOne(@Param('id') id: string) {
    return this.agenciesService.findOne(+id);
  }

  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.updateAgency.roles,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(AgencyApiUrl.UPDATE_AGENCY + '/:id')
  update(@Param('id') id: string, @Body() updateAgencyDto: UpdateAgencyDto) {
    return this.agenciesService.update(+id, updateAgencyDto);
  }

  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.deleteAgency.roles,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(AgencyApiUrl.DELETE_AGENCY + '/:id')
  remove(@Param('id') id: string) {
    return this.agenciesService.remove(+id);
  }
}
