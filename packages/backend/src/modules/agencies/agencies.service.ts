import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UpdateAgencyDto } from './dto/update-agency.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Agency } from './entities/agency.entity';
import { Repository } from 'typeorm';
import { CommonDtoResp } from '~/shared/dto/commonResp.dto';
import { Category } from '../categories/entities/category.entity';
import { IGetAgencyResDto } from '~/shared/interfaces/agencies/response/IAgencyRes.dto';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createAgencyDto: CreateAgencyDto) {
    try {
      const category = await this.categoryRepository.findOne({ 
        where: { 
          id: createAgencyDto.categoryId 
        },
        relations: {
          agency: true
        }
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${createAgencyDto.categoryId} not found`);
      }

      if (category.agency) {
        throw new BadRequestException(`Category already belongs to an agency: ${category.agency.name}`);
      }

      const agency = this.agencyRepository.create({
        ...createAgencyDto,
        category: category,
      });
      const savedAgency = await this.agencyRepository.save(agency);
      const response: IGetAgencyResDto = {
        id: savedAgency.id,
        name: savedAgency.name,
        description: savedAgency.description,
        email: savedAgency.email,
        category: {
          id: savedAgency.category.id,
          name: savedAgency.category.name,
          createdAt: savedAgency.category.createdAt,
        },
        createdAt: savedAgency.createdAt,
      };
      return new CommonDtoResp('ok', 'Agency created successfully', response);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const agencies = await this.agencyRepository.find({
        order: {
          createdAt: 'DESC',
        },
        relations: {
          category: true
        }
      });
      const response: IGetAgencyResDto[] = agencies.map(agency => ({
        id: agency.id,
        name: agency.name,
        description: agency.description,
        email: agency.email,
        category: {
          id: agency.category.id,
          name: agency.category.name,
          createdAt: agency.category.createdAt,
        },
        createdAt: agency.createdAt,
      }));
      return new CommonDtoResp('ok', 'Agencies retrieved successfully', response);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const agency = await this.agencyRepository.findOne({ where: { id } });
      if (!agency) {
        throw new NotFoundException(`Agency with ID ${id} not found`);
      }
      const response: IGetAgencyResDto = {
        id: agency.id,
        name: agency.name,
        description: agency.description,
        email: agency.email,
        category: {
          id: agency.category.id,
          name: agency.category.name,
          createdAt: agency.category.createdAt,
        },
        createdAt: agency.createdAt,
      };
      return new CommonDtoResp('ok', 'Agency retrieved successfully', response);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateAgencyDto: UpdateAgencyDto) {
    try {
      const agency = await this.agencyRepository.findOne({ where: { id } });
      if (!agency) {
        throw new NotFoundException(`Agency with ID ${id} not found`);
      }

      const category = await this.categoryRepository.findOne({ 
        where: { id: updateAgencyDto.categoryId },
        relations: {
          agency: true
        }
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${updateAgencyDto.categoryId} not found`);
      }

      if (category.agency && category.agency.id !== id) {
        throw new BadRequestException(`Category already belongs to an agency: ${category.agency.name}`);
      }

      agency.category = category;
      agency.name = updateAgencyDto.name;
      agency.description = updateAgencyDto.description;
      agency.email = updateAgencyDto.email;
      const updatedAgency = await this.agencyRepository.save(agency);
      
      const response: IGetAgencyResDto = {
        id: updatedAgency.id,
        name: updatedAgency.name,
        description: updatedAgency.description,
        email: updatedAgency.email,
        category: {
          id: updatedAgency.category.id,
          name: updatedAgency.category.name,
          createdAt: updatedAgency.category.createdAt,
        },
        createdAt: updatedAgency.createdAt,
      };
      return new CommonDtoResp('ok', 'Agency updated successfully', response);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const agency = await this.agencyRepository.findOne({ where: { id } });
      if (!agency) {
        throw new NotFoundException(`Agency with ID ${id} not found`);
      }

      await this.agencyRepository.softDelete(id);
      return new CommonDtoResp('ok', 'Agency deleted successfully', null);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
