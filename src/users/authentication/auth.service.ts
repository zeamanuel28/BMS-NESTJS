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

  async login(loginDto: LoginDto) {
    // Step 1: Find the user by email
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });
  
    // Step 2: If user doesn't exist, throw UnauthorizedException
    if (!user) {
      throw new UnauthorizedException('user doesnt exist');
    }
  
    // Step 3: Check if the name matches and if the password is correct
    if (user.name !== loginDto.name) {
      throw new UnauthorizedException('the name is not found');
    }
  
    // Step 4: Compare the password using bcrypt
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password mismatch');
    }
  
    // Step 5: Generate JWT token if everything matches
    const accessToken = this.generateToken(user);
  
    return { access_token: accessToken };
  }
  
  
}
