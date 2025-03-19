import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';  // Assuming the User entity exists
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepository: Repository<User>,  
  ) {}

  // ✅ Implemented generateToken properly
  generateToken(user: User): string {
    const payload = { name: user.name, email: user.email};
    return this.jwtService.sign(payload);
  }

  // Login method
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({ where: { username: loginDto.name } });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const accessToken = this.generateToken(user);

    return { access_token: accessToken };
  }
}
