import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Full name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'Email address of the user', example: 'john.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ description: 'Password (minimum 6 characters)', example: 'securePassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: 'User role (optional)', example: 'admin', required: false })
  @IsString()
  readonly role?: string;
}
