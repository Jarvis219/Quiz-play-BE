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
  @IsEmail()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @Matches(usernameRegex)
  @MaxLength(30)
  username: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @MaxLength(20)
  @IsString()
  first_name: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @MaxLength(30)
  @IsString()
  last_name: string;

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

export class RegisterViaGoogleDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  picture: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  given_name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  family_name: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class ChangePasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  password: string;
}
