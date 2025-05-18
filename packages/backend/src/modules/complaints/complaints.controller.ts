import { Controller, Get, Post, Body, Patch, Param, Delete, SetMetadata, UseGuards } from '@nestjs/common';
import { ComplaintsService } from './complaints.service';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { ComplaintApiUrl } from '~/shared/variables/urls';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/RolesGuard.guard';
import { PERMISSION_NAME_KEY } from '~/shared/constants/auth';
import { permissions } from '~/shared/constants/auth/permissions.constants';
import { ResponseComplaintDto } from './dto/respond-complaint.dto';

@ApiTags('Complaints')
@Controller(ComplaintApiUrl.CONTROLLER)
export class ComplaintsController {
  constructor(private readonly complaintsService: ComplaintsService) {}

  @Post(ComplaintApiUrl.CREATE_COMPLAINT)
  create(@Body() createComplaintDto: CreateComplaintDto) {
    return this.complaintsService.create(createComplaintDto);
  }

  @Get(ComplaintApiUrl.GET_COMPLAINTS)
  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.getComplaints.roles,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAll() {
    return this.complaintsService.findAll();
  }

  @Post(ComplaintApiUrl.GET_BULK_COMPLAINTS)
  findBulk(@Body() trackingCodes: string[]) {
    return this.complaintsService.findBulk(trackingCodes);
  }

  @Get(ComplaintApiUrl.GET_COMPLAINT + '/:trackingCode')
  findOne(@Param('trackingCode') trackingCode: string) {
    return this.complaintsService.findOne(trackingCode);
  }

  @Patch(ComplaintApiUrl.UPDATE_COMPLAINT + '/:id')
  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.updateComplaint.roles,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  update(@Param('id') id: string, @Body() updateComplaintDto: UpdateComplaintDto) {
    return this.complaintsService.update(+id, updateComplaintDto);
  }

  @Delete(ComplaintApiUrl.DELETE_COMPLAINT + '/:id')
  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.deleteComplaint.roles,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  remove(@Param('id') id: string) {
    return this.complaintsService.remove(+id);
  }
}
