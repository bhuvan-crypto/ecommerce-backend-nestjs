import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../types/user';

export class CreateUserDto {
  @ApiProperty({
    description: 'User role (either admin or customer)',
    enum: Role,
    example: 'customer',
  })
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    description: 'Unique username of the user',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password for the user (minimum 6 characters)',
    minLength: 6,
    example: 'strongPass123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Unique username of the user',
    example: 'admin@6969',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Password for the user (minimum 6 characters)',
    minLength: 6,
    example: 'strongPass123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export default CreateUserDto;
