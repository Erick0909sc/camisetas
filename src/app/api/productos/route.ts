import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

// OBTENER PRODUCTOS
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
    console.error(error);

    return NextResponse.json(
      { error: "Error al obtener los productos" },
      { status: 500 }
    );
  }
}

// CREAR PRODUCTO
export async function POST(request: Request) {
  try {
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

    if (!name || !team || !price || !imageFront) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        team,
        description,
        price: Number(price),
        category,
        imageFront,
        imageBack,
        variants: {
          create: variants.map((variant) => ({
            player: variant.player || null,
            number:
              variant.number !== undefined && variant.number !== ""
                ? Number(variant.number)
                : null,
            size: variant.size,
            stock: Number(variant.stock),
            imageBack: variant.imageBack || null,
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error al crear el producto" },
      { status: 500 }
    );
  }
}