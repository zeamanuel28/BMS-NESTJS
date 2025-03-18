import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './auth.strategy';  // Fixed typo from 'auth.stratagy' to 'auth.strategy'
import { AuthGuard } from './auth.guard';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users.module'; // Import UsersModule to validate user credentials

@Module({
  imports: [
    UsersModule,  // Ensure UsersModule is imported for user validation
    JwtModule.registerAsync({
      imports: [],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), // Use environment variable for JWT secret
        signOptions: { expiresIn: '60m' }, // Set token expiration time (e.g., 60 minutes)
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],  // Controllers related to authentication
  providers: [AuthService, JwtStrategy, AuthGuard],  // Auth-related services and guards
  exports: [AuthService],  // Export AuthService to be used by other modules
})
export class AuthModule {}
