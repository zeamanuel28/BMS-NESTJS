import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/controller/users.controller';
import { UsersService } from './users/service/users.service';
import { BooksController } from './books/controller/book.controller';
import { BooksService } from './books//service/book.service';
import { User } from './users/entity/user.entity';
import { Book } from './books/entity/book.entity';
import { AuthModule } from './users/authentication/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    // Configure TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres', // Specify your DB type
      host: 'localhost',
      port: 5432, // Change according to your DB
      username: 'postgres',
      password: 'root',
      database: 'postgres',
      entities: [User, Book], // Register both User and Book entities
      synchronize: true, // Set this to false in production
    }),
    // Import TypeOrmModule with the User and Book entities
    TypeOrmModule.forFeature([User, Book]),
    AuthModule,
  ],
  controllers: [UsersController, BooksController],
  providers: [UsersService, BooksService],
})
export class AppModule {}
