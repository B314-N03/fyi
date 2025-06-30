
import InfluencerDetailsPage from "@/app/_components/influencerDetailsPage/InfluencerDetailsPage";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";


export type paramsType = Promise<{ id: string }>;
export default async function InfluencerDetailsServer({ params }: { params: paramsType }) {
    const influencerId = (await params).id;
    const influencer = await prisma.influencer.findUnique({ where: { id: influencerId } });
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || '';
    const isFavorited = await prisma.favorite.findUnique({ where: { userId_influencerId: { userId: userId, influencerId: influencerId } } });
    
    if (!influencer) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white p-8 rounded-xl shadow text-center text-black w-full max-w-2xl">
                    <h1 className="text-2xl font-bold">Influencer not found</h1>
                </div>
            </div>
        );
    }

   
    return (
      <InfluencerDetailsPage
        isFavorited={!!isFavorited}
        userId={userId}
        {...influencer}
      />
    );
}
