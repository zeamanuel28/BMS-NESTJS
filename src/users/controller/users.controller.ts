import { Controller, Get, Post, Body, Param, Put, Delete, NotFoundException, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entity/user.entity';
import { AuthService } from '../authentication/auth.service'; // Import AuthService
import { LoginDto } from '../authentication/login.dto'; // Import LoginDto
import { AuthGuard } from '../authentication/auth.guard'; // Import AuthGuard

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService, // Inject AuthService
  ) {}

  // Create a new user
  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  // Get all users (protected)
  @Get()
  @UseGuards(AuthGuard) // Protect this route
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  // Get a single user by ID (protected)
  @Get(':id')
  @UseGuards(AuthGuard) // Protect this route
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    try {
      return await this.usersService.findOne(id);
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // Update a user (protected)
  @Put(':id')
  @UseGuards(AuthGuard) // Protect this route
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      return await this.usersService.update(id, updateUserDto);
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // Delete a user (protected)
  @Delete(':id')
  @UseGuards(AuthGuard) // Protect this route
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.usersService.remove(id);
    } catch (error) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  // Login route
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto); // Call the login method from AuthService
  }
}
