import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Complaint } from "./complaint.entity";

@Entity('responses')
export class Response {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  response: string;

  @OneToOne(() => Complaint, (complaint) => complaint.response, { onDelete: 'SET NULL' })
  complaint: Complaint;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deletedAt: Date;
}