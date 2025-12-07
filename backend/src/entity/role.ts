import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { PermissionType } from "../types/permission.types.js";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "enum", enum: PermissionType, unique: true })
  name: PermissionType;

  @Column("boolean", { default: false })
  isDeleted?: boolean;
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("varchar", { length: 20, nullable: false, unique: true })
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  permission?: Permission[];
}
