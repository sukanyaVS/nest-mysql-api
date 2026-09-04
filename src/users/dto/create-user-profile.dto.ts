import {
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  bio?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;
}