import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Font } from "./font.js";
import { User } from "./user.js";

@Entity("payment")
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  stripePaymentId: string;

  @Column("varchar")
  status: "pending" | "succeeded" | "failed";

  @Column("numeric")
  amount: number;


  @ManyToOne(() => Font)
  @JoinColumn({ name: "fontId" })
  font: Font;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column("timestamp", { default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;
}
