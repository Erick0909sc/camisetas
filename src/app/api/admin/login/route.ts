import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
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

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Correo y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    // Buscar el administrador en PostgreSQL
    const admin = await prisma.admin.findUnique({
      where: {
        email: email.toLowerCase().trim(),
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Correo o contraseña incorrectos" },
        { status: 401 }
      );
    }

    // Comparar contraseña con el hash guardado
    const passwordCorrect = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordCorrect) {
      return NextResponse.json(
        { error: "Correo o contraseña incorrectos" },
        { status: 401 }
      );
    }

    // Crear sesión
    const cookieStore = await cookies();

    cookieStore.set(
      "admin_session",
      `${admin.id}.${createSessionToken(admin.id)}`,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error iniciando sesión:", error);

    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}