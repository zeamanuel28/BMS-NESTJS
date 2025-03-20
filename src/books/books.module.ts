import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../users/controller/users.controller';
import { UsersService } from '../users/service/users.service';
import { BooksController } from '../books/controller/book.controller';
import { BooksService } from '../books/service/book.service';
import { User } from '../users/entity/user.entity';
import { Book } from '../books/entity/book.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'postgres',
      entities: [User, Book],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Book]),
  ],
  controllers: [UsersController, BooksController],
  providers: [UsersService, BooksService],
})
export class AppModule {}
