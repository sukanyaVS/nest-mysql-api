import { IsEmail, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateUserProfileDto } from './create-user-profile.dto';
import { CreatePostDto } from './create-post.dto';

export class CreateUserDto {
  @IsString({message: 'Name must be a string'})
  @MinLength(3, {message: 'Name must be at least 3 characters long'})
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  posts?: CreatePostDto[];

  @IsOptional()
  profile?: CreateUserProfileDto;

}