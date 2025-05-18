import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, SetMetadata } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryApiUrl } from '~/shared/variables/urls';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PERMISSION_NAME_KEY } from '~/shared/constants/auth';
import { RolesGuard } from '../auth/guards/RolesGuard.guard';
import { permissions } from '~/shared/constants/auth/permissions.constants';

@ApiTags('Categories')
@Controller(CategoryApiUrl.CONTROLLER)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post(CategoryApiUrl.CREATE_CATEGORY)
  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.createCategory.roles,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get(CategoryApiUrl.GET_CATEGORIES)
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(CategoryApiUrl.GET_CATEGORIES_WITH_COMPLAIN_COUNT)
  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.getCategoriesWithComplainCount.roles,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  findAllWithComplainCount() {
    return this.categoriesService.findAllWithComplainCount();
  }

  @Get(CategoryApiUrl.GET_CATEGORY + '/:id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.updateCategory.roles,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(CategoryApiUrl.UPDATE_CATEGORY + '/:id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @SetMetadata(PERMISSION_NAME_KEY, {
    roles: permissions.deleteCategory.roles,
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(CategoryApiUrl.DELETE_CATEGORY + '/:id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
