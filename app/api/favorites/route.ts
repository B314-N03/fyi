import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(){
    const favorites = await prisma.favorite.findMany();
    return NextResponse.json(favorites);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { influencerId, userId } = body;
    if (!influencerId || !userId) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    const favorite = await prisma.favorite.create({
      data: { influencerId, userId },
    });

    return NextResponse.json(favorite);
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ message: 'Invalid JSON or server error' }, { status: 500 });
  }
}


export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const influencerId = searchParams.get('influencerId');
  const userId = searchParams.get('userId');

  if (!influencerId || !userId) {
    return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
  }

  const favorite = await prisma.favorite.delete({
    where: {
      userId_influencerId: {
        influencerId,
        userId,
      },
    },
  });
  revalidatePath('/favorites');
  return NextResponse.json(favorite);
}

