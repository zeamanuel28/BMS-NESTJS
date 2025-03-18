import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { AuthModule } from './authentication/auth.module'; // Correct path
import { User } from '../users/entity/user.entity'; // Ensure correct path
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),  // Register User entity
    forwardRef(() => AuthModule),  // Use forwardRef() to fix circular dependency
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService, TypeOrmModule],  // Export TypeOrmModule if needed in AuthModule
})
export class UsersModule {}
