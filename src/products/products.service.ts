import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  
  private readonly logger = new Logger('ProductsService');
  
  // GetAll
  // Get UUID
  // Delete
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository <Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {

    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  findAll() {
    const products = this.productRepository.find()
    return products;
  }

  async findOne(id: string) {
    const product = this.productRepository.findOneBy({id});
    if (!product) 
    throw new NotFoundException(`Product with ID ${id} not found`);
    return product;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
    return product;
  }

  private handleExceptions (error: any) {
    if (error.code === '23505') {
      const errorDetail = error.detail;
      const match = errorDetail.match(/\(.*?\)=\((.*?)\)/);
      this.logger.error(`Ocurrió un error, errorCode: ${error.code}`)
if (match) {
const variableName = match[1].split('=')[0];
throw new BadRequestException(this.logger.error(`Error: Valor de la propiedad duplicado: ${variableName}`))
}
    } else if (error.code === '23502') {
      const errorDetail = error.column;
      this.logger.error(`Ocurrió un error, errorCode: ${error.code}`)
      const variableName = errorDetail.split('""')[0];
      throw new BadRequestException(this.logger.error(`Error, te faltó enviar un parametro: ${variableName}`))
    } 
    
    
    else {
      this.logger.error(error.code)
      this.logger.error(error)
      console.log(error)
      throw new InternalServerErrorException('Ocurrió un error inesperado')
    }
  }
}

