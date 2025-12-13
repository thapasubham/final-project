import AppDataSource from "../../data-source.js";
import { Payment } from "../../entity/payment.js";
import { Font } from "../../entity/font.js";
import { User } from "../../entity/user.js";
import { PaymentStatus } from "../../types/payment.types.js";

const paymentRepo = AppDataSource.getRepository(Payment);
const fontRepo = AppDataSource.getRepository(Font);

export class PaymentDB {
  // Create a new pending payment
  static async Create(
    userId: number,
    fontId: number,
    stripePaymentId: string,
    amount: number
  ) {
    const font = await fontRepo.findOne({ where: { id: fontId } });
    if (!font) throw new Error("Font not found");

    const payment = paymentRepo.create({
      stripePaymentId,
      status: PaymentStatus.FAILED,
      amount,
      user: { id: userId } as User,
      font: { id: fontId } as Font,
    });

    return await paymentRepo.save(payment);
  }

  // Read payments for a user or by status
  static async Read(
    userId?: number,
    status?: PaymentStatus
  ) {
    let query = paymentRepo.createQueryBuilder("payment")
      .leftJoinAndSelect("payment.user", "user")
      .leftJoinAndSelect("payment.font", "font");

    if (userId) query = query.andWhere("user.id = :userId", { userId });
    if (status) query = query.andWhere("payment.status = :status", { status });

    return await query.getMany();
  }

  static async UpdateStatus(
    stripePaymentId: string,
    status: PaymentStatus
  ) {
    const payment = await paymentRepo.findOne({
      where: { stripePaymentId },
    });
    if (!payment) throw new Error("Payment not found");

    payment.status = status;
    return await paymentRepo.save(payment);
  }
}
