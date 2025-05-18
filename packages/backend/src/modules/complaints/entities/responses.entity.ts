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

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}