import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/users.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {
    @ApiProperty({
        example: "0ac1c0e2-777b-460a-a0c7-411176642120",
        description: "Product ID",
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;


    @ApiProperty({
        example: "T-Shirt Teslo",
        description: "Product Title",
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;


    @ApiProperty({
        example: "0",
        description: "Product Price",
    })
    @Column('float',{
        default: 0
    })
    price: number;

    @ApiProperty({
        example: "Anim reprehenderit nulla in anim mollit minim irure commodo.",
        description: "Product Description",
        default: "null"
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: "t_shirt_teslo",
        description: "Product Slug - for SEO",
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: "10",
        description: "Product Stock",
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty({
        example: ["M", "XL", "XXL"],
        description: "Product Sizes",
    })
    @Column('text',{
        array: true
    })
    sizes: string[];


    @ApiProperty({
        example: "women",
        description: "Product Gender",
    })
    @Column('text')
    gender: string;

    
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[]

    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager: true}
    )
    user: User

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
          }
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ' , '_')
        .replaceAll("'" , '')
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if (!this.slug) {
            this.slug = this.title;
          }
        this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ' , '_')
        .replaceAll("'" , '')
    }
}
