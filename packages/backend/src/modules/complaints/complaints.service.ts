import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Complaint } from './entities/complaint.entity';
import { CommonDtoResp } from '~/shared/dto/commonResp.dto';
import { Agency } from '../agencies/entities/agency.entity';
import { Category } from '../categories/entities/category.entity';
import { v4 as uuidv4 } from 'uuid';
import { IGetComplaintResDto } from '~/shared/interfaces/complaints/response/IComplaintRes.dto';
import axios from 'axios';
import { ResponseComplaintDto } from './dto/respond-complaint.dto';
import { Response } from './entities/responses.entity';

@Injectable()
export class ComplaintsService {
  constructor(
    @InjectRepository(Complaint)
    private complaintsRepository: Repository<Complaint>,
    @InjectRepository(Agency)
    private agencyRepository: Repository<Agency>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Response)
    private responseRepository: Repository<Response>,
  ) {}

  async create(createComplaintDto: CreateComplaintDto) {
    try {
      let category: Category;
      if (createComplaintDto.categoryId) {
        category = await this.categoryRepository.findOne({ 
          where: { id: createComplaintDto.categoryId },
          relations: {
            agency: true
          }
        });
        if (!category) {
          throw new NotFoundException(`The category you selected does not exist`);
        }
      }

      const complaintTrackingCode = uuidv4().substring(0, 8);
      
      const complaint = this.complaintsRepository.create({
        ...createComplaintDto,
        category: category,
        trackingCode: complaintTrackingCode,
        agency: (category && category.agency) ? category.agency : null
      });

      
      const savedComplaint = await this.complaintsRepository.save(complaint);
      const response: IGetComplaintResDto = {
        status: savedComplaint.status,
        trackingCode: savedComplaint.trackingCode,
        createdAt: savedComplaint.createdAt,
        updatedAt: savedComplaint.updatedAt,
        names: savedComplaint.names,
        title: savedComplaint.title,
        telephone: savedComplaint.telephone,
        email: savedComplaint.email,
        description: savedComplaint.description,
        category: savedComplaint.category ? {
          id: savedComplaint.category.id,
          name: savedComplaint.category.name,
          createdAt: savedComplaint.category.createdAt,
        } : null,
        agency: savedComplaint.agency ? {
          id: savedComplaint.agency.id,
          name: savedComplaint.agency.name,
          createdAt: savedComplaint.agency.createdAt,
          category: savedComplaint.agency.category ? {
            id: savedComplaint.agency.category.id,
            name: savedComplaint.agency.category.name,
            createdAt: savedComplaint.agency.category.createdAt,
          } : null,
        } : null,
      }
      return new CommonDtoResp('ok', 'Complaint created successfully', response);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const complaints = await this.complaintsRepository.find({
        order: {
          createdAt: 'DESC',
        },
        relations: {
          category: {
            agency: true
          },
          agency: {
            category: true
          },
          response: true
        }
      });

      const response: IGetComplaintResDto[] = complaints.map(complaint => ({
        id: complaint.id,
        trackingCode: complaint.trackingCode,
        status: complaint.status,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
        names: complaint.names,
        title: complaint.title,
        telephone: complaint.telephone,
        email: complaint.email,
        description: complaint.description,
        category: complaint.category ? {
          id: complaint.category.id,
          name: complaint.category.name,
          createdAt: complaint.category.createdAt,
        } : null,
        agency: complaint.agency ? {
          id: complaint.agency.id,
          name: complaint.agency.name,
          createdAt: complaint.agency.createdAt,
          category: complaint.agency.category ? {
            id: complaint.agency.category.id,
            name: complaint.agency.category.name,
            createdAt: complaint.agency.category.createdAt,
          } : null,
          description: complaint.agency.description,
          email: complaint.agency.email,
        } : null,
        response: complaint.response ? {
          id: complaint.response.id,
          response: complaint.response.response,
          createdAt: complaint.response.createdAt,
        } : null,
      }));

      return new CommonDtoResp('ok', 'Complaints retrieved successfully', response);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findBulk(trackingCodes: string[]) {
    try {
      const complaints = await this.complaintsRepository.find({
        where: { trackingCode: In(trackingCodes) },
        relations: {
          category: {
            agency: true
          },
          agency: true,
          response: true
        },
        order: {
          createdAt: 'DESC',
        }
      });

      const response: IGetComplaintResDto[] = complaints.map(complaint => ({
        id: complaint.id,
        trackingCode: complaint.trackingCode,
        status: complaint.status,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
        names: complaint.names,
        title: complaint.title,
        telephone: complaint.telephone,
        email: complaint.email,
        description: complaint.description,
        category: complaint.category ? {
          id: complaint.category.id,
          name: complaint.category.name,
        } : null,
        agency: complaint.agency ? {
          id: complaint.agency.id,
          createdAt: complaint.agency.createdAt,
          name: complaint.agency.name,
        } : null,
        response: complaint.response ? {
          id: complaint.response.id,
          response: complaint.response.response,
          createdAt: complaint.response.createdAt,
        } : null,
      }));

      return new CommonDtoResp('ok', 'Complaints retrieved successfully', response);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(trackingCode: string) {
    try {
      const complaint = await this.complaintsRepository.findOne({ 
        where: { 
          trackingCode: trackingCode
        },
        relations: {
          agency: true,
          response: true
        }
      });
      if (!complaint) {
        throw new NotFoundException(`Complaint with ID ${trackingCode} not found`);
      }

      const response: IGetComplaintResDto = {
        status: complaint.status,
        trackingCode: complaint.trackingCode,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt,
        names: complaint.names,
        title: complaint.title,
        telephone: complaint.telephone,
        email: complaint.email,
        description: complaint.description,
        category: complaint.category ? {
          id: complaint.category.id,
          name: complaint.category.name,
        } : null,
        agency: complaint.agency ? {
          id: complaint.agency.id,
          name: complaint.agency.name,
          createdAt: complaint.agency.createdAt,
        } : null,
        response: complaint.response ? {
          id: complaint.response.id,
          response: complaint.response.response,
          createdAt: complaint.response.createdAt,
        } : null,
      }
      return new CommonDtoResp('ok', 'Complaint retrieved successfully', response);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateComplaintDto: UpdateComplaintDto) {
    try {
    const complaint = await this.complaintsRepository.findOne({ 
      where: { 
        id 
      },
      relations: {
        response: true
      }
    });
    if (!complaint) {
      throw new NotFoundException(`Complaint with ID ${id} not found`);
    }

    if (updateComplaintDto.categoryId) {
      const category = await this.categoryRepository.findOne({ 
        where: { id: updateComplaintDto.categoryId },
        relations: {
          agency: true
        }
      });
      if (!category) {
        throw new NotFoundException(`The category you selected does not exist`);
      }
      complaint.category = category;
      complaint.agency = category.agency;
    }
    
    if (updateComplaintDto.responseText && complaint.response) {
      complaint.response.response = updateComplaintDto.responseText;
      await this.responseRepository.save(complaint.response);
    } else if (updateComplaintDto.responseText && !complaint.response) {
      const response = this.responseRepository.create({
        response: updateComplaintDto.responseText,
        complaint: complaint
      });
      const savedResponse = await this.responseRepository.save(response);
      complaint.response = savedResponse;
    }

    const updatedComplaint = await this.complaintsRepository.save({
      ...complaint,
      ...updateComplaintDto
    });

    const response: IGetComplaintResDto = {
      status: updatedComplaint.status,
      trackingCode: updatedComplaint.trackingCode,
      createdAt: updatedComplaint.createdAt,
      updatedAt: updatedComplaint.updatedAt,
      names: updatedComplaint.names,
      title: updatedComplaint.title,
      telephone: updatedComplaint.telephone,
      email: updatedComplaint.email,
      description: updatedComplaint.description,
      category: updatedComplaint.category ? {
        id: updatedComplaint.category.id,
        name: updatedComplaint.category.name,
        createdAt: updatedComplaint.category.createdAt,
      } : null,
      agency: updatedComplaint.agency ? {
        id: updatedComplaint.agency.id,
        name: updatedComplaint.agency.name,
        createdAt: updatedComplaint.agency.createdAt,
        category: updatedComplaint.agency.category ? {
          id: updatedComplaint.agency.category.id,
          name: updatedComplaint.agency.category.name,
          createdAt: updatedComplaint.agency.category.createdAt,
        } : null,
      } : null,
      response: updatedComplaint.response ? {
        id: updatedComplaint.response.id,
        response: updatedComplaint.response.response,
        createdAt: updatedComplaint.response.createdAt,
      } : null,
    }

    return new CommonDtoResp('ok', 'Complaint updated successfully', response);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const complaint = await this.complaintsRepository.findOne({ where: { id } });
      if (!complaint) {
        throw new NotFoundException(`Complaint with ID ${id} not found`);
      }

      await this.complaintsRepository.softDelete(id);
      return new CommonDtoResp('ok', 'Complaint deleted successfully', null);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    }
  }
  
}
