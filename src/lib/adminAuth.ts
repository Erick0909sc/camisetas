import { cookies } from "next/headers";
import crypto from "crypto";

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

export async function isAdminAuthenticated() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;

    if (!session) {
      return false;
    }

    const [adminIdString, token] = session.split(".");
    const adminId = Number(adminIdString);

    if (!adminId || !token) {
      return false;
    }

    const expectedToken = createSessionToken(adminId);

    return token === expectedToken;
  } catch {
    return false;
  }
}