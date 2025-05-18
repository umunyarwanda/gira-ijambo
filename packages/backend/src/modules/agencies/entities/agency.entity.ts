import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Category } from "~/modules/categories/entities/category.entity";

@Entity('agencies')
export class Agency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  email: string;
  
  // @ManyToOne(() => Category, (category) => category.agencies, { onDelete: 'SET NULL' })
  // category: Category;

  @OneToMany(() => Category, (category) => category.agency)
  categories: Category[];

  @OneToOne(() => Category, (category) => category.agency, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  category: Category;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deletedAt: Date;
}
