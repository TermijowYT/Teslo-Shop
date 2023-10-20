import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { validRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/users.entity';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}


  @Post()
  @Auth()
  @ApiResponse({status: 201, description: 'Product was created', type: Product})
  @ApiResponse({status: 400, description: 'Bad Request'})
  @ApiResponse({status: 403, description: 'Forbidden. Token Related.'})
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(validRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
    @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(validRoles.admin)
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
