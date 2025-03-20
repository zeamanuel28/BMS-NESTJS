import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthService } from '../authentication/auth.service'; // Inject AuthService for token generation

@Injectable()
export class UsersService {
  async findByEmail(email: string): Promise<User | null> {  
    return this.userRepository.findOne({ where: { email } });
  }
  
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService, // Inject AuthService
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<{ user: User; access_token: string }> {
    // Step 1: Hash the password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10); // 10 is the salt rounds
  
    // Step 2: Create a new user with the hashed password
    const user = this.userRepository.create({
      ...createUserDto, // other fields from createUserDto
      password: hashedPassword, // hashed password
    });
  
    // Step 3: Save the user
    const savedUser = await this.userRepository.save(user);
  
    // Step 4: Generate JWT token after user creation
    const accessToken: string = this.authService.generateToken(savedUser);
  
    console.log("Generated Token:", accessToken);
    console.log("Type of access_token:", typeof accessToken); // Should print 'string'
  
    return {
      user: savedUser,
      access_token: accessToken,
    };
  }


  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
