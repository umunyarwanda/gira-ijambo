import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { IGetCategoryResDto, IGetCategoryResDtoWithcomplainCount } from '~/shared/interfaces/categories/response/ICategoryRes.dto';
import { CommonDtoResp } from '~/shared/dto/commonResp.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoryRepository.create(createCategoryDto);
      const savedCategory = await this.categoryRepository.save(category);
      const response: IGetCategoryResDto = {
        id: savedCategory.id,
        name: savedCategory.name,
        createdAt: savedCategory.createdAt,
      };
      return new CommonDtoResp('ok', 'Category created successfully', response);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const categories = await this.categoryRepository.find({
        order: {
          createdAt: 'DESC',
        },
        relations: {
          agency: true,
        },
      });
      const response: IGetCategoryResDto[] = categories.map(category => ({
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        agency: category.agency ? {
          id: category.agency.id,
          name: category.agency.name,
          description: category.agency.description,
          email: category.agency.email,
          createdAt: category.agency.createdAt,
        } : null,
      }));
      return new CommonDtoResp('ok', 'Categories retrieved successfully', response);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAllWithComplainCount() {
    try {
      const categories = await this.categoryRepository.find({
        order: {
          createdAt: 'DESC',
        },
        relations: {
          agency: true,
          complaints: true,
        },
      });
      const response: IGetCategoryResDtoWithcomplainCount[] = categories.map(category => ({
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        agency: category.agency ? {
          id: category.agency.id,
          name: category.agency.name,
          description: category.agency.description,
          email: category.agency.email,
          createdAt: category.agency.createdAt,
        } : null,
        complainCount: category.complaints ? category.complaints.length : 0,
      }));
      return new CommonDtoResp('ok', 'Categories retrieved successfully', response);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoryRepository.findOne({ 
        where: { 
          id 
        }, 
        relations: { 
          agency: true 
        } 
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }
      const response: IGetCategoryResDto = {
        id: category.id,
        name: category.name,
        createdAt: category.createdAt,
        agency: category.agency ? {
          id: category.agency.id,
          name: category.agency.name,
          description: category.agency.description,
          email: category.agency.email,
          createdAt: category.agency.createdAt,
        } : null,
      };
      return new CommonDtoResp('ok', 'Category retrieved successfully', response);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      category.name = updateCategoryDto.name;
      const updatedCategory = await this.categoryRepository.save(category);
      
      const response: IGetCategoryResDto = {
        id: updatedCategory.id,
        name: updatedCategory.name,
        createdAt: updatedCategory.createdAt,
      };
      return new CommonDtoResp('ok', 'Category updated successfully', response);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      await this.categoryRepository.softDelete(id);
      return new CommonDtoResp('ok', 'Category deleted successfully', null);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
