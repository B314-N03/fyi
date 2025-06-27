import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import InfluencerFilterPage from "../_components/influencerFilterPage/InfluencerFilterPage";

export default async function Influencer() {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const influencer = await prisma.influencer.findMany({});
  const favorites = await prisma.favorite.findMany({ where: { userId }, select: { influencerId: true } });
  const favoriteIds = favorites.map(favorite => favorite.influencerId);

  return (
    <InfluencerFilterPage
      influencers={influencer}
      favoriteIds={favoriteIds}
    />
  );
}