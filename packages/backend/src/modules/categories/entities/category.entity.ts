import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Agency } from "~/modules/agencies/entities/agency.entity";
import { Complaint } from "~/modules/complaints/entities/complaint.entity";

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Agency, (agency) => agency.category)
  agency: Agency;

  @OneToMany(() => Complaint, (complaint) => complaint.category)
  complaints: Complaint[];

  // @OneToMany(() => Agency, (agency) => agency.category)
  // agencies: Agency[];

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'datetime', nullable: true })
  deletedAt: Date;
}
