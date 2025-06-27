import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const influencers = await prisma.influencer.findMany();
  return NextResponse.json(influencers);
}
