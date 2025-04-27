import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ default: false })
  isPhoneVerified: boolean;

  @Column({ unique: true })
  openid: string;

  @Column({ nullable: true })
  sessionKey: string;

  @Column({ default: 'user' })
  role: string; // 'employer' 雇主 or 'worker' 接单人

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 