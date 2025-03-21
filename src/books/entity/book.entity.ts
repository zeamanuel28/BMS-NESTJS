import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from 'src/users/entity/user.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column({ nullable: true }) // ✅ Optional column for PDF file storage
  pdf: string;

  @ManyToOne(() => User, (user) => user.books, { onDelete: 'CASCADE' }) 
  @JoinColumn({ name: 'userId' }) // ✅ Defines the foreign key column
  user: User;

  @Column()
  userId: number; // ✅ Explicitly store the foreign key
}
