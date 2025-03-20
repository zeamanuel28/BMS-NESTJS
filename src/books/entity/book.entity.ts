import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from 'src/users/entity/user.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true }) // ✅ New column to store the PDF filename
  pdf: string;

  @ManyToOne(() => User, (user) => user.books, { onDelete: 'CASCADE' }) 
  user: User;
}
