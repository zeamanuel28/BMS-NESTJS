import { 
  Controller, Get, Post, Body, UseInterceptors, UploadedFile, BadRequestException 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InjectRepository } from '@nestjs/typeorm'; // ✅ Import InjectRepository
import { Repository } from 'typeorm'; // ✅ Import Repository
import { BooksService } from '../service/book.service';
import { Book } from '../entity/book.entity';
import { User } from '../../users/entity/user.entity'; // ✅ Import User entity
import { CreateBookDto } from '../dto/create-book.dto';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    @InjectRepository(User) private readonly userRepository: Repository<User> // ✅ Inject userRepository correctly
  ) {}

  @Get()
  getAllBooks(): Promise<Book[]> {
    return this.booksService.findAll();
  }
  @Post()
  @UseInterceptors(FileInterceptor('pdf', {
    storage: diskStorage({
      destination: './uploads',
      filename: (_req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        callback(null, uniqueSuffix + extname(file.originalname));
      },
    }),
    fileFilter: (_req, file, callback) => {
      if (file.mimetype !== 'application/pdf') {
        return callback(new BadRequestException('Only PDF files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async createBook(
    @Body() bookData: CreateBookDto,
    @UploadedFile() file: any
  ): Promise<Book> {
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }
  
    const { userId } = bookData;
  
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
  
    // Convert `userId` to a number (Ensure Type Consistency)
    const user = await this.userRepository.findOne({ where: { id: Number(userId) } });
  
    if (!user) {
      throw new BadRequestException('Invalid User ID: User does not exist');
    }
  
    // Save the book with the userId
    const uploadedFile = file as unknown as { filename: string };
    const newBookData = { 
      ...bookData, 
      pdf: uploadedFile.filename, 
      userId: Number(userId) // Ensure it's a number
    };
  
    return this.booksService.create(newBookData);
  }
  

}
