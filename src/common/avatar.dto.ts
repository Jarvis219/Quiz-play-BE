import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class AvatarDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  id: number;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url: string;
}

export class UpdateAvatarDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  url: string;
}

export class AvatarByIdDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  id: number;
}
