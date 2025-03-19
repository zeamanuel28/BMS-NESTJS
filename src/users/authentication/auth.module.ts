import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../authentication/auth.service';
import { AuthController } from '../authentication/auth.controller';
import { JwtStrategy } from '../authentication/auth.strategy';
import { AuthGuard } from '../authentication/auth.guard';
import { ConfigService,ConfigModule } from '@nestjs/config';
import { UsersModule } from '../users.module'; // Corrected path

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => UsersModule),  // Use forwardRef to resolve circular dependency
    JwtModule.registerAsync({
      imports: [],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
