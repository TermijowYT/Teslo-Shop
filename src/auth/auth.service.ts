import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';
import { LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService

    ) {}


  async create(createUserDto: CreateUserDto) {
    
    try {

      const { password, ...userData } = createUserDto;


      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ email: user.email })
      };

    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async login(loginUserDto : LoginUserDto) {
    try {
      const {password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true , password: true }
      });

      if (!user)
        throw new UnauthorizedException('Las credenciales no son validas (email)')
      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Las credenciales no son validas (password)')
      return {
        ...user,
        token: this.getJwtToken({ email: user.email })
      };
      // Retornar el JWT
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  private getJwtToken( payload: JwtPayload ) {

    const token = this.jwtService.sign( payload );
    return token; 

  }


  private handleExceptions (error: any): never {

    if (error.code === "23505")
      throw new BadRequestException(error.detail);
    console.log(error);

    throw new InternalServerErrorException('revisa los logs del server')
  }
}
