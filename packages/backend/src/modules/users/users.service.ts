import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { hashString } from '~/shared/utils/hashing/password.hashing.util';
import { CommonDtoResp } from '~/shared/dto/commonResp.dto';
import { IGetUserResDto } from '~/shared/interfaces/users/response/IGetUserResDto';
import * as moment from 'moment';
import { EPaymentStatus } from '~/shared/enums/EPaymentStatus.enum';
import { EUserRole } from '~/shared/enums/EUserRole.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto, user?: User, queryRunner?: QueryRunner) {
    try {
      if (createUserDto.password !== createUserDto.confirmPassword) {
        throw new BadRequestException('Password and confirm password do not match');
      }

      const entityManager = queryRunner ? queryRunner.manager : this.userRepository.manager;

      const checkUser = await entityManager.findOne(User, {
        where: { email: createUserDto.email }
      });

      if (checkUser) throw new BadRequestException('User with this email already exists');

      const hashedPassword = await hashString(createUserDto.password);

      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        isActive: true,
      });

      const savedUser = await entityManager.save(newUser);
      
      const response = {
        ...savedUser,
      }

      return new CommonDtoResp('ok', 'User created successfully', response);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createSystemUser() {
    try {
      const systemUserEmail = 'admin@user.com';
      // check if there is already a system user
      const systemUser = await this.userRepository.findOne({
        where: {
          email: systemUserEmail
        }
      });

      if (systemUser) throw new BadRequestException('System user already exists');

      const hashedPassword = await hashString('123');

      const newUser = this.userRepository.create({
        firstName: 'Super',
        lastName: 'Admin',
        email: systemUserEmail,
        password: hashedPassword,
        isActive: true,
        role: EUserRole.SUPER_ADMIN,
      });

      await this.userRepository.save(newUser);

      return new CommonDtoResp('ok', 'System user created successfully');
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // async createUserOnlyWithPermissions(createUserDto: CreateUserDto, user?: User) {
  //   const queryRunner = this.userRepository.manager.connection.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {
  //     const createUser = await this.create(createUserDto, user, queryRunner);

  //     if (!createUser) throw new InternalServerErrorException('Failed to create user');

  //     await queryRunner.commitTransaction();

  //     await this.permissionsService.setDefaultPermissions(createUser.data.id);

  //     return new CommonDtoResp('ok', 'User created successfully with permissions', createUser.data);

  //   } catch (error: any) {
  //     throw new InternalServerErrorException(error.message);
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async findAll(user: User) {
    try {
      let users: User[] = [];
      users = await this.userRepository.find({
        order: {
          id: 'DESC'
        },
        relations: {
        },
        where: {
        }
      });

      const response: IGetUserResDto[] = users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        phone: user.phone,
      }));

      return new CommonDtoResp('ok', 'Users fetched successfully', response);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: {
        }
      });

      if (!user) throw new NotFoundException('User not found');

      const response: IGetUserResDto = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        phone: user.phone,
      }

      return new CommonDtoResp('ok', 'User fetched successfully', response);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto, queryRunner?: QueryRunner) {
    try {
      const entityManager = queryRunner ? queryRunner.manager : this.userRepository.manager;

      const user = await entityManager.findOne(User, {
        where: { id }
      });

      if (!user) throw new NotFoundException('User not found');

      if (updateUserDto.email) {
        const existingUser = await entityManager.findOne(User, {
          where: { email: updateUserDto.email }
        });

        if (existingUser && existingUser.id !== id) {
          throw new BadRequestException('User with this email already exists');
        }
      }

      if (updateUserDto.password) {
        const hashedPassword = await hashString(updateUserDto.password);
        user.password = hashedPassword;
      }

      user.firstName = updateUserDto.firstName;

      user.firstName = updateUserDto.firstName;
      user.lastName = updateUserDto.lastName;
      user.role = updateUserDto.role;
      user.isActive = updateUserDto.isActive;
      const updatedUser = await entityManager.save(user);

      return new CommonDtoResp('ok', 'User updated successfully');
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id }
      });

      if (!user) throw new NotFoundException('User not found');

      await this.userRepository.softDelete(id);

      return new CommonDtoResp('ok', 'User deleted successfully');
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  // Common services will be here
  // async getAnalytics() {
  //   try {
  //     const currentDate = moment().format('YYYY-MM-DD');
  //     const usersCount = await this.userRepository.count();
  //     const employeesCount = await this.employeeRepository.count();
  //     const attendancesCount = await this.attendanceRepository.count({
  //       where: {
  //         date: currentDate
  //       }
  //     });
  //     const sitesCount = await this.siteRepository.count();
  //     const recentAttendances = await this.attendanceRepository.find({
  //       take: 6,
  //       order: {
  //         date: 'DESC'
  //       },
  //       relations: {
  //         employee: {
  //           site: true
  //         },
  //         payment: true
  //       },
  //     });

  //     const sitesWithAttendanceCountQuery = await this.siteRepository.find({
  //       relations: {
  //         employees: {
  //           attendances: true
  //         }
  //       },
  //     });

  //     const sitesWithAttendanceCount = sitesWithAttendanceCountQuery.map((site) => ({
  //       id: site.id,
  //       location: site.siteLocation,
  //       attendanceCount: site.employees.reduce((acc, employee) => {
  //         const todayAttendances = employee.attendances.filter(attendance => 
  //           moment(attendance.date).format('YYYY-MM-DD') === currentDate
  //         );
  //         return acc + todayAttendances.length;
  //       }, 0)
  //     }));

  //     const analytics = {
  //       labels: sitesWithAttendanceCount.map((site) => site.location),
  //       datasets: [
  //         {
  //           label: 'Attendance Count',
  //           data: sitesWithAttendanceCount.map((site) => site.attendanceCount)
  //         }
  //       ]
  //     };
  //     const response: IGetAnalyticsResDto = {
  //       usersCount,
  //       employeesCount,
  //       attendancesCount,
  //       sitesCount,
  //       recentAttendances: recentAttendances ? recentAttendances.map((attendance) => ({
  //         id: attendance.id,
  //         paymentStatus: attendance.payment ? attendance.payment.paymentStatus : EPaymentStatus.NOT_PAID,
  //         employee: attendance.employee ? {
  //           id: attendance.employee.id,
  //           firstName: attendance.employee.firstName,
  //           lastName: attendance.employee.lastName,
  //           idNumber: attendance.employee.idNumber,
  //           phoneNumber: attendance.employee.phoneNumber,
  //           dob: attendance.employee.dob,
  //           hiredDate: attendance.employee.hiredDate,
  //           names: `${attendance.employee.firstName} ${attendance.employee.lastName}`,
  //           salary: attendance.employee.salary,
  //           gender: attendance.employee.gender,
  //           site: attendance.employee.site ? {
  //             id: attendance.employee.site.id,
  //             siteLocation: attendance.employee.site.siteLocation,
  //             deviceName: attendance.employee.site.deviceName,
  //             deviceSerialNumber: attendance.employee.site.deviceSerialNumber
  //           } : null
  //         } : null,
  //         date: attendance.date as Date,
  //         checkIn: attendance.checkIn,
  //         checkOut: attendance.checkOut
  //       })) : [],
  //       sitesWithAttendanceCount: sitesWithAttendanceCount ? sitesWithAttendanceCount.map((site) => ({
  //         id: site.id.toString(),
  //         location: site.location,
  //         attendanceCount: site.attendanceCount
  //       })) : [],
  //       analytics
  //     } 

  //     return new CommonDtoResp('ok', 'Analytics fetched successfully', response);
  //   } catch (error: any) {
  //     if (error.message.includes('Unknown column')) {
  //       throw new BadRequestException('Invalid column name in query');
  //     }
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }
}
