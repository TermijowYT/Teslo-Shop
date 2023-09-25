import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, Length, MinLength } from "class-validator";

export class CreateProductDto {
    @IsString()
    @Length(1-50)
    title:string;
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;
    @IsString()
    @IsOptional()
    description?: string;
    @IsString()
    @IsOptional()
    slug?: string;
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock: number;
    @IsString({each: true})
    @IsArray()
    sizes: string[];
    
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

}
