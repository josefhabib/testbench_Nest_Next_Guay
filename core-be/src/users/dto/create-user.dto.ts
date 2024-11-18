import { IsString, IsNotEmpty, MinLength, MaxLength, IsStrongPassword, IsEmail } from 'class-validator';

export class CreateUserDto {

  @IsEmail()
  readonly email: string;

  @IsStrongPassword()
  readonly password: string;
}