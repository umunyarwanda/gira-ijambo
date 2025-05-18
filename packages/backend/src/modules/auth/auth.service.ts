import { BadRequestException, HttpException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { compareHash, hashString } from 'src/shared/utils/hashing/password.hashing.util';
import { IAuthTokenData, ILoginResDto } from 'src/shared/interfaces/auth/response/ILoginResDto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CommonDtoResp } from '~/shared/dto/commonResp.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { MailerService } from '@nestjs-modules/mailer';
// import { OtpEmailTemplate } from '~/shared/]utils/email/templates/OtpEmailTemplate';
import { Notification } from '../notifications/entities/notification.entity';
import * as moment from 'moment';
import { EUserRole } from '~/shared/enums/EUserRole.enum';
import { permissions } from '~/shared/constants/auth/permissions.constants';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private readonly mailerService: MailerService,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>
  ) {}

  async login(loginAuthDto: LoginAuthDto) {
    try {
      const checkUser = await this.userRepository.findOne({
        where: { email: loginAuthDto.email },
        relations: {}
      })

      if (!checkUser) throw new NotFoundException('User not found');

      const checkPassword = await compareHash(loginAuthDto.password, checkUser.password);

      if (!checkPassword) throw new UnauthorizedException('Invalid credentials');

      if (!checkUser.isActive) throw new UnauthorizedException('Sorry, your account has been deactivated');

      const authTokenData: IAuthTokenData = {
        id: checkUser.id,
        email: checkUser.email,
        firstName: checkUser.firstName,
        lastName: checkUser.lastName,
        role: checkUser.role,
        isActive: checkUser.isActive,
        phone: checkUser.phone
      }

      const accessToken: string = await this.generateAccessToken(authTokenData);

      const response: ILoginResDto = {
        accessToken: accessToken
      }

      return new CommonDtoResp('ok', 'Login successful', response);
    } catch (error: any) {
      throw new HttpException(error.message, error.status);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    try {
      const checkUser = await this.userRepository.findOne({
        where: { email: resetPasswordDto.email }
      })

      if (!checkUser) throw new NotFoundException('User not found');

      if (!checkUser.isActive) throw new UnauthorizedException('Sorry, your account has been deactivated');

      if (!resetPasswordDto.otp) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await this.storeOtp(checkUser.id, otp, checkUser.email);

        const notification = this.notificationRepository.create({
          to: checkUser.email,
          subject: 'Reset Password OTP',
          emailText: 'Reset Password OTP',
          emailContent: `OtpEmailTemplate({otp: otp})`
        });

        await this.notificationRepository.save(notification);

        console.log(await this.getOtp(checkUser.id, checkUser.email));

        return new CommonDtoResp('ok', 'OTP code sent to your email');
      } else {
        const storedOtp = await this.getOtp(checkUser.id, checkUser.email);

        if (storedOtp !== resetPasswordDto.otp) throw new UnauthorizedException('Invalid OTP');

        console.log('OTP is valid', resetPasswordDto.otp);

        if (resetPasswordDto.newPassword) {
          if (!resetPasswordDto.confirmPassword) throw new BadRequestException('Confirm password is required');

          if (resetPasswordDto.newPassword !== resetPasswordDto.confirmPassword) throw new BadRequestException('Passwords do not match');

          const hashedPassword = await hashString(resetPasswordDto.newPassword);

          checkUser.password = hashedPassword;

          await this.userRepository.save(checkUser);

          return new CommonDtoResp('ok', 'Password reset successful', null);
        } else {
          throw new BadRequestException('Invalid OTP');
        }
      }
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async generateAccessToken(authTokenData: IAuthTokenData) {
    try {
      const expiresIn = this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN') ?? '30d';
      const secretKey = this.configService.get('JWT_AUTH_KEY') ?? '';

      const token = await this.jwtService.signAsync(authTokenData, { 
        expiresIn, 
        secret: secretKey 
      });

      return token;
    } catch (error: any) {
      throw new HttpException(error.message, error.status);
    } 
  }

  async storeOtp(userId: number, otp: string, userEmail: string) {
    const cacheKey = `otp:${userId}-${userEmail}`;
    await this.cacheManager.set(cacheKey, otp, 300000);
  }

  async getOtp(userId: number, userEmail: string) {
    const cacheKey = `otp:${userId}-${userEmail}`;
    return await this.cacheManager.get(cacheKey);
  }
}
