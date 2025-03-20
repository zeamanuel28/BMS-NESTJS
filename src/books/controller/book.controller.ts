import { Controller, Get, Post, Body, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
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
  @UseInterceptors(FileInterceptor('pdf', {
    storage: diskStorage({
      destination: './uploads',
      filename: (_req: any, file: { originalname: string; }, callback: (arg0: null, arg1: string) => void) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (req, file, callback) => {
      if (file.mimetype !== 'application/pdf') {
        return callback(new BadRequestException('Only PDF files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async createBook(
    @Body() bookData: Partial<Book>,
    @UploadedFile() file: any // ✅ Use `any` to avoid TypeScript errors
  ): Promise<Book> {
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }

    // ✅ Explicitly cast the file
    const uploadedFile = file as unknown as { filename: string };

    // ✅ Ensure `pdf` field exists in bookData
    const newBookData: Partial<Book> & { pdf?: string } = { ...bookData, pdf: uploadedFile.filename };

    return this.booksService.create(newBookData);
  }
}
