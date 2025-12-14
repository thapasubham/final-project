import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.js";

@Entity("font")
export class Font {

  @PrimaryGeneratedColumn()
  id?: number;

  @Column("varchar", { nullable: false, unique: true })
  name: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: "created_by" })
  createdBy: User;

  @Column("varchar", { nullable: false })
  fileName: string;

  @Column("numeric", { default: 5 })
  price: number;

  @ManyToMany(() => Language)
  @JoinTable()
  langs: Language[];
}

@Entity("language")
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { nullable: false, unique: true })
  name: string;
}

@Entity("user_font")
export class UserFont {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Font)
  font: Font;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  purchasedAt: Date;
}
