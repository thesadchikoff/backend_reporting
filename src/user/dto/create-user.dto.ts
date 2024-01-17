import {ISubdivision} from "../../interfaces/subdivision.interface";
import {IsEmail, IsNotEmpty} from "class-validator";

export class CreateUserDto {
    @IsNotEmpty()
    first_name: string

    @IsNotEmpty()
    second_name: string

    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string
}
