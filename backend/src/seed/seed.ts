import AppDataSource from "../data-source";
import { Permission, Role } from "../entity/role";
import { User } from "../entity/user";
import { PermissionType } from "../types/permission.types";

export const seedPermission = async () => {
  try {
    const permissionRepository = AppDataSource.getRepository(Permission);

    const permissions = Object.values(PermissionType);

    for (const perm of permissions) {
      const existing = await permissionRepository.findOne({
        where: { name: perm },
      });
      if (!existing) {
        const newPermission = permissionRepository.create({ name: perm });
        await permissionRepository.save(newPermission);
        console.log(`Permission '${perm}' created`);
      } else {
        console.log(`Permission '${perm}' already exists`);
      }
    }

    console.log("Seeding completed!");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
};

export const seedAdminRole = async () => {
  try {
    console.log("Seeding admin");

    const roleRepo = AppDataSource.getRepository(Role);
    const permRepo = AppDataSource.getRepository(Permission);

    // Find admin role with permissions
    let adminRole = await roleRepo.findOne({
      where: { name: "admin" },
      relations: ["permission"],
    });

    // Create role if missing
    if (!adminRole) {
      adminRole = await roleRepo.save(
        roleRepo.create({
          name: "admin",
          permission: [],
        })
      );
    }

    // Get all permissions
    const allPermissions = await permRepo.find();

    // Assign them all
    adminRole.permission = allPermissions;

    await roleRepo.save(adminRole);

    console.log("Admin role seeded with all permissions!");
  } catch (err) {
    console.error("Error seeding admin role:", err);
  }
};

export const seedAdminUser = async () => {
  try {
    console.log("👤 Seeding admin user...");

    const userRepo = AppDataSource.getRepository(User);
    const roleRepo = AppDataSource.getRepository(Role);

    // 1️⃣ Ensure admin role exists
    const adminRole = await roleRepo.findOne({ where: { name: "admin" } });

    if (!adminRole) {
      console.error("❌ Admin role not found. Seed roles first.");
      return;
    }

    // 2️⃣ Check if user exists by email
    let adminUser = await userRepo.findOne({
      where: { email: "admin@example.com" },
      relations: ["role"],
    });

    if (!adminUser) {
      // 3️⃣ Create admin user
      adminUser = userRepo.create({
        firstname: "Admin",
        lastname: "User",
        email: "admin@example.com",
        password: "Admin@123", // will be auto-hashed by entity hook
        phoneNumber: "9800000000",
        role: adminRole,
      });

      await userRepo.save(adminUser);
      console.log("✅ Admin user created!");
    } else {
      // 4️⃣ Ensure correct role
      if (!adminUser.role || adminUser.role.id !== adminRole.id) {
        adminUser.role = adminRole;
        await userRepo.save(adminUser);
        console.log("🔄 Admin role assigned to existing user.");
      }

      console.log("ℹ️ Admin user already exists.");
    }
  } catch (err) {
    console.error("❌ Error seeding admin user:", err);
  }
};

export const seedUserRole = async () => {
  try {
    console.log("Seeding user role");

    const roleRepo = AppDataSource.getRepository(Role);
    const permRepo = AppDataSource.getRepository(Permission);

    // Find user role with permissions
    let userRole = await roleRepo.findOne({
      where: { name: "user" },
      relations: ["permission"],
    });

    // Create role if missing
    if (!userRole) {
      userRole = await roleRepo.save(
        roleRepo.create({
          name: "user",
          permission: [],
        })
      );
    }

    const allowedPermissions = await permRepo.find({
      where: [
        { name: PermissionType.EDIT },
        { name: PermissionType.VIEW },
        { name: PermissionType.DELETE },
      ],
    });

    userRole.permission = allowedPermissions;

    await roleRepo.save(userRole);

    console.log("User role seeded with edit, view, delete!");
  } catch (err) {
    console.error("Error seeding user role:", err);
  }
};
