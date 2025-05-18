import { CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Column } from "typeorm";
import { EEmailStatus } from "~/shared/enums/EEmailStatus.enum";

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  to: string;

  @Column({nullable: true})
  subject: string;

  @Column({nullable: true, type: 'text'})
  emailContent: string;

  @Column({nullable: true})
  emailText: string;

  @Column({type: 'enum', enum: EEmailStatus, default: EEmailStatus.PENDING})
  status: EEmailStatus;

  @CreateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @UpdateDateColumn({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;

  @DeleteDateColumn({type: 'timestamp', nullable: true})
  deletedAt: Date;
}
