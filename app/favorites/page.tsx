import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import InfluencerBox from "../_components/influencerBox/InfluencerBox";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

export default async function Favorites() {
    const session = await getServerSession(authOptions);
    const favorites = await prisma.favorite.findMany({ where: { userId: session?.user?.id } });
    const favoritedInfluencer = await prisma.influencer.findMany({ where: { id: { in: favorites.map(favorite => favorite.influencerId) } } });
    return (
        <div className="flex flex-col gap-3">
            <h1>Favorites</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                favoritedInfluencer.length === 0 
                ?
                    <h2 className="text-gray-500">No favorites yet</h2>
                :
                    favoritedInfluencer.map((favoritedInfluencer) => (
                    <InfluencerBox
                        key={favoritedInfluencer.id}
                        {...favoritedInfluencer}
                        isFavorited
                        userId={session?.user?.id || ''}
                    />
                ))}
            </div>
        </div>
    );
}