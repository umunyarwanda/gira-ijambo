import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { AuthApiUrl } from 'src/shared/variables/urls';
import { ApiProperty, ApiTags, ApiExcludeEndpoint, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller(AuthApiUrl.CONTROLLER)
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Login to the system' })
  @Post(AuthApiUrl.LOGIN)
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @ApiOperation({ summary: 'Reset password' })
  @Post(AuthApiUrl.RESET_PASSWORD)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @ApiExcludeEndpoint()
  @Get()
  findAll() {
    return this.authService.findAll();
  }
  
  @ApiExcludeEndpoint()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @ApiExcludeEndpoint()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @ApiExcludeEndpoint()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
