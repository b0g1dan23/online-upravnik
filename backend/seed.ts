import * as dotenv from "dotenv";
import { AppDataSource } from "data-source";
import { User, UserRoleEnum } from "src/users/users.entity";
dotenv.config();

async function seed() {
    await AppDataSource.initialize();
    // use entity name to avoid importing files that use path aliases
    const userRepo = AppDataSource.getRepository(User);

    const existingAdmin = await userRepo.findOne({ where: { role: UserRoleEnum.MANAGER } });

    if (!existingAdmin) {
        const password = process.env.ADMIN_PASSWORD;
        const admin = userRepo.create({
            firstName: "Pedja",
            lastName: "Dimitrijevic",
            email: "admin@gmail.com",
            password,
            role: UserRoleEnum.MANAGER,
            phoneNumber: "+381 61 4564654"
        });

        await userRepo.save(admin);
        console.log("✅ Admin user created");
    } else {
        console.log("ℹ️ Admin user already exists");
    }

    await AppDataSource.destroy();
}

seed().catch((err) => {
    console.error("❌ Error during seed:", err);
    process.exit(1);
});
