import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { Product, ProductImage } from './entities';
import { User } from 'src/auth/entities/users.entity';


@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository <Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository <ProductImage>,
    private readonly dataSource : DataSource,
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {

    try {
      const {images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image})),
        user: user
      });
      await this.productRepository.save(product);
      return {...product, images};
    } catch (error) {
      this.handleExceptions(error)
    }
  }

  async findAll(paginationDto : PaginationDto) {


    const {limit = 10, offset = 0} = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations:{
        images: true,
        
      }
    })
    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }));
  }

  async findOne(term: string) {

    let product: Product;
    
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({id: term});
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
      .where('UPPER(title)=:title or slug=:slug', {
        title: term.toUpperCase(),
        slug: term.toLowerCase(),
      }).leftJoinAndSelect('prod.images', 'prodImages')
      .getOne();
    }


    // const product = this.productRepository.findOneBy({term});
    if (!product) 
    throw new NotFoundException(`Product with term ${term} not found`);
    return product;
  }

  async findOnePlain(term: string) {
    const {images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }


  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    const { title, images, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({
      id: id,
      slug: title,
      ...updateProductDto,
      images: [],
      user: user,
    });
    if (!product) throw new BadRequestException(`No se encontró el producto con el id: ${id} que buscabas`)
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      if (images) {
        await queryRunner.manager.delete(ProductImage, {product: {id}});
        product.images = images.map(image => this.productImageRepository.create({url: image}));
      }

      product.user = user;

      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();


      // await this.productRepository.save(product);
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error);
    }

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
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
      .delete()
      .where({})
      .execute();
      
    } catch (error) {
      
    }
  }
}

