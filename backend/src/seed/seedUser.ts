import { DataSource } from "typeorm";
import { User } from "../entity/user.js";
import { Role } from "../entity/role";

// Example first and last names
const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller"];

function getRandomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomEmail(first: string, last: string, existingEmails: Set<string>, randomRole: string): string {
    let email: string;
    do {
        email = `${first.toLowerCase()}.${last.toLowerCase()}${Math.floor(Math.random() * 1000)}@${randomRole}.com`;
    } while (existingEmails.has(email));
    existingEmails.add(email);
    return email;
}

function getRandomPhone(existingPhones: Set<string>): string {
    let phone: string;
    do {
        phone = "98" + Math.floor(10000000 + Math.random() * 90000000).toString(); // 10-digit starting with 98
    } while (existingPhones.has(phone));
    existingPhones.add(phone);
    return phone;
}

export async function seedUsers(dataSource: DataSource, count: number) {
    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);

    const roles = await roleRepo.find();
    if (!roles.length) throw new Error("No roles found to assign to users");

    const existingEmails = new Set<string>();
    const existingPhones = new Set<string>();
    const adminRole = await roleRepo.findOne({ where: { name: "admin" } });
    const userRole = await roleRepo.findOne({ where: { name: "user" } });
    const users = []
    for (let i = 0; i < count; i++) {
        const randomRole = i % 10 == 0 ? adminRole : userRole;
        const first = getRandomItem(firstNames);
        const last = getRandomItem(lastNames);

        const user = userRepo.create({
            firstname: first,
            lastname: last,
            email: getRandomEmail(first, last, existingEmails, randomRole.name),
            phoneNumber: getRandomPhone(existingPhones),
            password: "password123", // will be hashed automatically
            role: randomRole,
        });

        users.push(user);
    }
    const result = await userRepo.save(users);
    console.log(`${result.length} users seeded successfully!`);
}
