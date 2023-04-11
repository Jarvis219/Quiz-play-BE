import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserDto {
  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  @IsString()
  full_name: string;

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

  @ApiProperty()
  @IsString()
  verify_email_token: string;
}

export class ChangePasswordProfile {
  @ApiProperty()
  @IsString()
  @IsOptional()
  currentPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
}

export class UpdateProfileDto {
  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  @MaxLength(50)
  @IsString()
  full_name: string;

  @ApiProperty({ required: false, default: '' })
  @Matches(/^(0)[0-9]{9,10}$/)
  @IsOptional()
  @IsString()
  phone_number: string;

  @ApiProperty({ required: false, default: '' })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ required: false, default: null })
  @IsOptional()
  @IsString()
  avatar: string;
}
