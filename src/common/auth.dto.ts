import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { usernameRegex } from '.';

export class LoginUsernameBodyDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class ForgotPasswordBodyDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ChangePasswordBodyDto {
  @ApiProperty({ required: true })
  token: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterViaUsernameDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  full_name: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(usernameRegex)
  @MaxLength(60)
  username: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  phone_number: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address: string;
}
