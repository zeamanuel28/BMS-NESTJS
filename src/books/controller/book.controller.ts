import { Controller, Get, Post, Body } from '@nestjs/common';
import { BooksService } from '../service/book.service';
import { Book } from '../entity/book.entity';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAllBooks(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Post()
  createBook(@Body() bookData: Partial<Book>): Promise<Book> {
    return this.booksService.create(bookData);
  }
}

