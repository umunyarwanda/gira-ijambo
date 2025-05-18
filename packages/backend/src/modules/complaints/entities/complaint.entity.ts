import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Agency } from "~/modules/agencies/entities/agency.entity";
import { Category } from "~/modules/categories/entities/category.entity";
import { User } from "~/modules/users/entities/user.entity";
import { EComplaintStatus } from "~/shared/enums/EComplainStatus.enum";
import { Response } from "./responses.entity";

@Entity('complaints')
export class Complaint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  names: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  telephone: string;

  @Column({ nullable: true })
  email: string;

  @ManyToOne(() => Agency, { nullable: true, onDelete: 'SET NULL' })
  // @JoinColumn({ name: 'agencyId' })
  agency: Agency;

  @OneToOne(() => Response, (response) => response.complaint, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn()
  response: Response;

  @ManyToOne(() => Category, { nullable: true, onDelete: 'SET NULL' })
  category: Category;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: EComplaintStatus,
    default: EComplaintStatus.PENDING
  })
  status: EComplaintStatus;

  @Column({ unique: true })
  trackingCode: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
  
  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deletedAt: Date;
}
