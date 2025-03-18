import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controller/users.controller';
import { UsersService } from './service/users.service';
import { User } from './entity/user.entity';
import { AuthModule } from './authentication/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,  // Add the AuthModule here
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
