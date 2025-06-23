import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("font")
export class Font {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar", { nullable: false, unique: true })
  name: string;

  @Column("varchar", { nullable: false })
  fileName: string;
}
