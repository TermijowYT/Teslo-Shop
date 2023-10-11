import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/users.entity';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    ) {}


  async create(createUserDto: CreateUserDto) {
    
    try {

      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return user;

    } catch (error) {
      this.handleExceptions(error)
    }

  }

  private handleExceptions (error: any): never {

    if (error.code === "23505")
      throw new BadRequestException(error.detail);
    console.log(error);

    throw new InternalServerErrorException('revisa los logs del server')
  }
}
