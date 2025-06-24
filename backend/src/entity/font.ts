import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("font")
export class Font {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column("varchar", { nullable: false, unique: true })
  name: string;

  @Column("varchar", { nullable: false })
  fileName: string;

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
