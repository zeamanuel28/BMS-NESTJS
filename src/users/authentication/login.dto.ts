import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // Import Swagger decorator

export class LoginDto {
  @ApiProperty({
    description: 'The name of the user',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    type: String,
  })
  @IsString()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    type: String,
  })
  @IsString()
  password: string;
}
