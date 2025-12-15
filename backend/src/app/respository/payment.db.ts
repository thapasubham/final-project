import AppDataSource from "../../data-source.js";
import { Payment } from "../../entity/payment.js";
import { Font, UserFont } from "../../entity/font.js";
import { User } from "../../entity/user.js";
import { PaymentStatus } from "../../types/payment.types.js";
import { getRepository } from "typeorm";

const paymentRepo = AppDataSource.getRepository(Payment);
const fontRepo = AppDataSource.getRepository(Font);
const userFontRepo = AppDataSource.getRepository(UserFont);
export class PaymentDB {
  static async Create(
    userId: number,
    fontId: number,
    stripePaymentId: string,
    amount: number
  ) {
    const font = await fontRepo.findOne({ where: { id: fontId } });
    if (!font) throw new Error("Font not found");
    const alreadyPurchased = await userFontRepo.findOne({
      where: {
        user: { id: userId },
        font: { id: fontId },
      },
    });
    console.log(alreadyPurchased);

    if (alreadyPurchased) {
      throw new Error("You have already purchased this font.");
    }
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
  static async Read(userId?: number, status?: PaymentStatus) {
    let query = paymentRepo
      .createQueryBuilder("payment")
      .leftJoinAndSelect("payment.user", "user")
      .leftJoinAndSelect("payment.font", "font");

    if (userId) query = query.andWhere("user.id = :userId", { userId });
    if (status) query = query.andWhere("payment.status = :status", { status });

    return await query.getMany();
  }

  static async UpdateStatus(stripePaymentId: string, status: PaymentStatus) {
    const payment = await paymentRepo.findOne({
      where: { stripePaymentId },
    });
    if (!payment) throw new Error("Payment not found");

    payment.status = status;
    return await paymentRepo.save(payment);
  }

  static async purchasedFonts(
    userId: number,
    offset = 0,
    limit = 5,
    sortBy: "name" | "price" | "purchasedAt" = "purchasedAt",
    order: "ASC" | "DESC" = "DESC"
  ) {
    const userFontRepo = AppDataSource.getRepository(UserFont);
    let qb = userFontRepo
      .createQueryBuilder("uf")
      .leftJoinAndSelect("uf.font", "font")
      .leftJoinAndSelect("uf.user", "user")
      .leftJoin("font.createdBy", "creator")
      .where("uf.userId = :userId", { userId })
      .limit(limit)
      .offset(offset);

    if (sortBy === "name") {
      qb.orderBy("font.name", order);
    } else if (sortBy === "price") {
      qb.orderBy("font.price", order);
    } else {
      qb.orderBy("uf.purchasedAt", order);
    }

    qb = qb.select([
      "user.id",
      "uf.purchasedAt",
      "font.id",
      "font.name",
      "font.fileName",
      "font.price",
      "font.created_by",
      "creator.id",
      "creator.firstname",
      "creator.lastname",
    ]);

    const [data, total] = await qb.getManyAndCount();
    console.log(data, total);
    return {
      data,
      total,
    };
  }
}
