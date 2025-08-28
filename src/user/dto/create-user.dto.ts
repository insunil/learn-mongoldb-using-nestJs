import { IsString, IsEmail, IsNotEmpty, IsOptional, IsInt, Min, Max, Matches } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsEmail()
    @IsNotEmpty()
    email!:string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsString()
    @IsNotEmpty()
    mobile!: string;

    @IsOptional()
    @IsString()
    gender?: string;

 @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    age?: number;
}
