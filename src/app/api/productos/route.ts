
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/adminAuth";

type ProductVariantInput = {
  player?: string;
  number?: number | string;
  size: string;
  stock: number | string;
  imageBack?: string;
};

type ProductInput = {
  name: string;
  team: string;
  description?: string;
  price: number | string;
  category?: string;
  imageFront: string;
  imageBack?: string;
  variants?: ProductVariantInput[];
};

// ========================================
// OBTENER PRODUCTOS - PUBLICO
// ========================================
export async function GET() {
  try {
    const productos = await prisma.product.findMany({
      include: {
        variants: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);

    return NextResponse.json(
      { error: "Error al obtener los productos" },
      { status: 500 }
    );
  }
}

// ========================================
// CREAR PRODUCTO - SOLO ADMINISTRADOR
// ========================================
export async function POST(request: Request) {
  try {
    // 1. Verificar que el usuario sea administrador
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        {
          error:
            "No autorizado. Debes iniciar sesión como administrador.",
        },
        { status: 401 }
      );
    }

    // 2. Obtener los datos enviados desde el admin
    const body: ProductInput = await request.json();

    const {
      name,
      team,
      description,
      price,
      category,
      imageFront,
      imageBack,
      variants = [],
    } = body;

    // 3. Validar los campos obligatorios
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof team !== "string" ||
      !team.trim() ||
      typeof imageFront !== "string" ||
      !imageFront.trim()
    ) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    // 4. Validar el precio
    const productPrice = Number(price);

    if (
      price === undefined ||
      price === null ||
      price === "" ||
      !Number.isFinite(productPrice) ||
      productPrice <= 0 ||
      productPrice > 99999999.99
    ) {
      return NextResponse.json(
        { error: "El precio debe ser un número positivo válido" },
        { status: 400 }
      );
    }

    // 5. Validar las variantes
    if (!Array.isArray(variants)) {
      return NextResponse.json(
        { error: "Las variantes deben ser una lista" },
        { status: 400 }
      );
    }

    for (const variant of variants) {
      if (
        !variant ||
        typeof variant.size !== "string" ||
        !variant.size.trim()
      ) {
        return NextResponse.json(
          { error: "Cada variante debe tener una talla" },
          { status: 400 }
        );
      }

      const stock = Number(variant.stock);

      if (!Number.isSafeInteger(stock) || stock < 0) {
        return NextResponse.json(
          {
            error:
              "El stock debe ser un número entero no negativo",
          },
          { status: 400 }
        );
      }

      if (
        variant.number !== undefined &&
        variant.number !== null &&
        variant.number !== "" &&
        (
          !Number.isSafeInteger(Number(variant.number)) ||
          Number(variant.number) < 0
        )
      ) {
        return NextResponse.json(
          { error: "El dorsal debe ser un número entero válido" },
          { status: 400 }
        );
      }
    }

    // 6. Crear el producto y sus variantes en Neon
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        team: team.trim(),

        description:
          typeof description === "string"
            ? description.trim()
            : null,

        price: productPrice,

        category:
          typeof category === "string"
            ? category.trim()
            : null,

        imageFront: imageFront.trim(),

        imageBack:
          typeof imageBack === "string" && imageBack.trim()
            ? imageBack.trim()
            : null,

        variants: {
          create: variants.map((variant) => ({
            player:
              typeof variant.player === "string" &&
              variant.player.trim()
                ? variant.player.trim()
                : null,

            number:
              variant.number !== undefined &&
              variant.number !== null &&
              variant.number !== ""
                ? Number(variant.number)
                : null,

            size: variant.size.trim(),

            stock: Number(variant.stock),

            imageBack:
              typeof variant.imageBack === "string" &&
              variant.imageBack.trim()
                ? variant.imageBack.trim()
                : null,
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json(product, {
      status: 201,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);

    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}
