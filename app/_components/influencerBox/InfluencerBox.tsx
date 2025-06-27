'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { IconButton } from '@/components/animate-ui/buttons/icon';
import { Heart } from "lucide-react";


interface InfluencerBoxProps {
  id: string;
  name: string;
  gender: string;
  age: number;
  platform: string[];
  followers: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  topics: string[];
  location: string;
  isFavorited: boolean;
  userId: string;
  shouldFetchAfterDelete?: boolean;
}

export default function InfluencerBox({
  id,
  name,
  gender,
  age,
  platform,
  followers,
  engagementRate,
  avgLikes,
  avgComments,
  topics,
  location,
  isFavorited,
  userId,
}: InfluencerBoxProps) {
  const [isFavoritedState, setIsFavoritedState] = useState(isFavorited);
  const [animationState, setAnimationState] = useState(isFavorited);
  const router = useRouter();
  const handleAddToFavorites = async () => {
    let endpoint = "/api/favorites";
    let options: RequestInit;

    if (isFavoritedState) {
      endpoint += `?influencerId=${encodeURIComponent(id)}&userId=${encodeURIComponent(userId)}`;
      options = { method: "DELETE" };
    } else {
      options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ influencerId: id, userId }),
      };
    }

    const res = await fetch(endpoint, options);

    if (!res.ok) return;
    setIsFavoritedState(!isFavoritedState);

    router.refresh()
    setTimeout(() => setAnimationState(!animationState), 1000);
  };

  return (
    <div
      className="border border-gray-300 rounded-xl p-6 shadow-md hover:shadow-lg transition bg-white hover:scale-102 w-full"
    >
      <div className="flex justify-between mb-4">
        <div className="flex flex-col justify-between mb-4 text-gray-600">
          <h2 className="text-xl font-semibold">{name}</h2>
          <span className="text-sm text-gray-500">{location}</span>
        </div>
        <IconButton
          icon={Heart}
          active={isFavoritedState}
          onClick={handleAddToFavorites}
          // dont animate on initial render, only animate when it hasnt been favorited yet
          animate={!animationState}
          color={isFavoritedState ? [255, 0, 0] : [0, 0, 0]}
        />
      </div>

      <div className="text-sm text-gray-600 mb-4">
        <p><b>Gender:</b> {gender} &nbsp; | &nbsp; <b>Age:</b> {age}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {platform.map((p) => (
          <span
            key={p}
            className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full"
          >
            {p}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm mb-4 text-gray-600">
        <p><b>Followers:</b> {followers.toLocaleString()}</p>
        <p><b>Engagement:</b> {engagementRate.toFixed(2)}%</p>
        <p><b>Avg Likes:</b> {avgLikes.toLocaleString()}</p>
        <p><b>Avg Comments:</b> {avgComments.toLocaleString()}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <span
            key={topic}
            className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}
