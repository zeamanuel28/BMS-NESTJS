import { 
  Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, UseGuards 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'; // Swagger decorators
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entity/user.entity';
import { AuthService } from '../authentication/auth.service';
import { LoginDto } from '../authentication/login.dto';
import { AuthGuard } from '../authentication/auth.guard';

@ApiTags('Users') // Group all endpoints under 'Users' in Swagger
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  async create(@Body() createUserDto: CreateUserDto): Promise<{ user?: User; access_token?: string; message: string }> {
    try {
      const existingUsers = await this.usersService.findAll();
      if (existingUsers.length === 0) {
        const result = await this.usersService.create(createUserDto);
        const token = this.authService.generateToken({
          name: result.user.name,
          email: result.user.email,
          id: 0,
          password: '',
          role: '',
          books: [],
          username: undefined
        });

        return {
          user: result.user,
          access_token: token,
          message: 'First user successfully created and token generated.',
        };
      } else {
        return {
          message: 'User creation is restricted. Please log in to create more users.',
        };
      }
    } catch (error) {
      return {
        message: 'User could not be created. Please try again.',
      };
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth() // Requires authentication (JWT)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users.' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.usersService.remove(id);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
