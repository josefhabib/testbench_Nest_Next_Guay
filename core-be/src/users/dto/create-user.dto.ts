import { IsString, IsNotEmpty, MinLength, MaxLength, IsStrongPassword, IsEmail } from 'class-validator';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(50)
  @IsStrongPassword()
  readonly password: string;
}