import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { Role } from "../schema/user.schema";


export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    name:string;

    @IsEmail()
    email:string;
    
    @IsString()
    @IsNotEmpty()
    username:string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password:string;

    @IsOptional()
    @IsEnum(Role,{each:true})
    roles?:Role;
}