
import "server-only";

import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

function createSessionToken(adminId: number) {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET no está configurado");
  }

  return crypto
    .createHmac("sha256", secret)
    .update(`admin-${adminId}`)
    .digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;

    if (!session) {
      return false;
    }

    const match = /^([1-9]\d*)\.([a-f0-9]{64})$/.exec(session);

    if (!match) {
      return false;
    }

    const adminId = Number(match[1]);
    const token = match[2];

    if (!Number.isSafeInteger(adminId)) {
      return false;
    }

    const expectedToken = createSessionToken(adminId);

    const receivedBuffer = Buffer.from(token, "hex");
    const expectedBuffer = Buffer.from(expectedToken, "hex");

    if (
      receivedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
    ) {
      return false;
    }

    // Verificar que el administrador siga existiendo en Neon
    const admin = await prisma.admin.findUnique({
      where: {
        id: adminId,
      },
      select: {
        id: true,
      },
    });

    return admin !== null;
  } catch (error) {
    console.error("Error verificando sesión del administrador:", error);
    return false;
  }
}
