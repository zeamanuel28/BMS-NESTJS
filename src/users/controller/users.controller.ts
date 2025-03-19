// Import necessary modules
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

  // ✅ Fix: Return both the user and access token
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<{ user: User; access_token: string }> {
    const result = await this.usersService.create(createUserDto); // Create user
    const loginResponse = await this.authService.login({ name: result.user.name, password: createUserDto.password });
  
    return {
      user: result.user,
      access_token: loginResponse.access_token, // Extract token from response
    };}
  

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
    return await this.usersService.findOne(id);
  }

  // Update a user (protected)
  @Put(':id')
  @UseGuards(AuthGuard) // Protect this route
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  // Delete a user (protected)
  @Delete(':id')
  @UseGuards(AuthGuard) // Protect this route
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(id);
  }

  // Login route
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto); // Call the login method from AuthService
  }
}
