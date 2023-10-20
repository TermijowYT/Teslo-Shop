import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty( {
        example: "admin@google.com",
            
    })
    @IsString()
    @IsEmail()
    email: string;
    

    @ApiProperty({
        example: "Securepassword123",
        minLength: 6,
        maxLength: 50,
        required: true
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;
    
    @ApiProperty({
        example: "John Doe",
        uniqueItems: false,
        maxLength: 60
    })
    @IsString()
    @MaxLength(60)
    fullName: string;
}