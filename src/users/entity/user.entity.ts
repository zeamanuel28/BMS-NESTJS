import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from 'src/books/entity/book.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true }) // Ensure email is unique
  email: string;

  @Column()
  password: string;

  @Column({ default: 'user' }) // Default role
  role: string;

  @OneToMany(() => Book, (books) => books.user)
  books: Book[];
  
}
