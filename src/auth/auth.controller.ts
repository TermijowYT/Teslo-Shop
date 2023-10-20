import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/users.entity';
import { Auth, GetUser, RawHeaders } from './decorators';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { validRoles } from './interfaces';
import { ApiResponse, ApiTags } from '@nestjs/swagger';



@ApiTags('Auth')

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({status: 201, description: 'User was created', type: User})
  @ApiResponse({status: 400, description: 'Missing Parameter or repeated email', type: User})

  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    @GetUser() user: User
  ) {
    return this.authService.checkAuthStatus(user)
  }

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request : Express.Request,
    @GetUser('email') userEmail: string,
    @GetUser() user : User,
    @GetUser('fullName') fullName : string,
    @RawHeaders() rawHeaders: string[],
  ) {
    
    console.log(request)

    return {
      ok: true,
      message:'Holamundo Private',
      user,
      userEmail,
      fullName,
      rawHeaders
    }
  }

  @Get('private2')
  @RoleProtected( validRoles.superUser )
  @UseGuards( AuthGuard(), UserRoleGuard )
  privateRoute2(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

  @Get('private3')
  @Auth(validRoles.admin, validRoles.superUser)
  privateRoute3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user
    }
  }

}
