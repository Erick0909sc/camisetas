import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";

async function main() {
  const prisma = new PrismaClient();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const email = (
      await rl.question("Correo del administrador: ")
    ).trim().toLowerCase();

    const password = process.env.ADMIN_INITIAL_PASSWORD;

    if (!email || !email.includes("@")) {
      throw new Error("Ingresa un correo válido.");
    }

    if (!password || password.length < 12) {
      throw new Error(
        "Configura ADMIN_INITIAL_PASSWORD con al menos 12 caracteres."
      );
    }

    const existing = await prisma.admin.findUnique({
      where: { email },
    });

    if (existing) {
      console.log("Este administrador ya existe.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    console.log("Administrador creado correctamente.");
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Error:", error.message);
  process.exitCode = 1;
});
