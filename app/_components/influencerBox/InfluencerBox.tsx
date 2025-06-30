'use client';

import { JSX, useState } from "react";
import { useRouter } from 'next/navigation';
import { IconButton } from '@/components/animate-ui/buttons/icon';
import { Heart } from "lucide-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok, faTwitch, faYoutube } from '@fortawesome/free-brands-svg-icons';
import Image from "next/image";
import Link from "next/link";

export interface InfluencerBoxProps {
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
  avatarImageLink: string;
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
  avatarImageLink
}: InfluencerBoxProps) {
  const [isFavoritedState, setIsFavoritedState] = useState(isFavorited);
  const [animationState, setAnimationState] = useState(isFavorited);
  const router = useRouter();
  const handleAddToFavorites = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const platformIcons: Record<string, JSX.Element | string> = {
    "Instagram": <FontAwesomeIcon icon={faInstagram} size="xl" />,
    "TikTok": <FontAwesomeIcon icon={faTiktok} size="xl" />,
    "YouTube": <FontAwesomeIcon icon={faYoutube} size="xl" />,
    "Twitch": <FontAwesomeIcon icon={faTwitch} size="xl" />,
  };

  const genderMap: Record<string, string> = {
    "male": "Male",
    "female": "Female",
    "non-binary": "Non-binary",
  }


  return (
    <Link
      href={`/influencer/${id}`}
      className="border border-gray-300 rounded-xl p-6 shadow-md hover:shadow-lg transition bg-white hover:scale-102 w-full"
    >
      <div className="flex justify-between mb-4">
        <div className="flex justify-between mb-4 text-gray-600 items-center gap-4">
          <div className="w-15 h-15 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-lg overflow-hidden">
            <Image
              src={avatarImageLink || ""}
              alt="avatar"
              width={128}
              height={128}
              quality={100}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold">{name}</h2>
            <span className="text-sm text-gray-500">{location}</span>
          </div>
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
        <p><b>Gender:</b> {genderMap[gender]} &nbsp; | &nbsp; <b>Age:</b> {age}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <h4 className="text-sm font-semibold text-gray-600">Platforms:</h4>
        {platform.map((platform) => (
          <span
            key={platform}
            className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1"
          >
            {platformIcons[platform] || platform}
            <span>{platform}</span>
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
        <h4 className="text-sm font-semibold text-gray-600">Topics:</h4>
        {topics.map((topic) => (
          <span
            key={topic}
            className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
          >
            {topic}
          </span>
        ))}
      </div>
    </Link>
  );
}
