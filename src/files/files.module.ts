import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  controllers: [FilesController],
  providers: [FilesService, ConfigService],
  imports: [ConfigModule],
})
export class FilesModule {}
