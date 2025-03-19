import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthService } from '../authentication/auth.service'; // Inject AuthService for token generation

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService, // Inject AuthService
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(createUserDto: CreateUserDto): Promise<{ user: User; access_token: string }> {
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);

    // Generate JWT token after user creation
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
