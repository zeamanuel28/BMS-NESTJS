import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ example: 'johndoe@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ example: 'securePass123', description: 'User password', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ example: 'user', description: 'User role (admin or user)', required: false })
  @IsString()
  readonly role?: string;
}
