'use client';
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faTiktok, faTwitch, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { JSX, useState } from "react";
import { IconButton } from "@/components/animate-ui/buttons/icon";
import { Heart } from "lucide-react";


interface InfluencerDetailsPageProps {
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
    avatarImageLink: string;
}

export default function InfluencerDetailsPage({
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
}: InfluencerDetailsPageProps){
    const [isFavoritedState, setIsFavoritedState] = useState(isFavorited);

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
        <div className="flex justify-center min-h-screen ">

            <div className="bg-white rounded-2xl shadow-lg p-8 h-fit mt-30 w-full max-w-3xl text-black relative">
                <div className="absolute top-4 right-4">
                    <IconButton
                        icon={Heart}
                        active={isFavoritedState}
                        onClick={handleAddToFavorites}
                        // dont animate on initial render, only animate when it hasnt been favorited yet
                        animate
                        color={isFavoritedState ? [255, 0, 0] : [0, 0, 0]}
                    />
                </div>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                        {avatarImageLink ? (
                            <Image
                                src={avatarImageLink}
                                alt={name}
                                width={128}
                                height={128}
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-400">
                                No Image
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold">{name}</h1>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-800">
                        <span className="bg-gray-200 px-2 py-1 rounded">{genderMap[gender]}</span>
                        <span className="bg-gray-200 px-2 py-1 rounded">{age} years</span>
                        <span className="bg-gray-200 px-2 py-1 rounded">{location}</span>
                    </div>
                </div>
                {/* Split layout for statistics and topics/platforms */}
                <div className="mt-8 flex flex-col md:flex-row gap-8">
                    {/* Statistics */}
                    <div className="flex-1 space-y-2">
                        <div>
                            <span className="font-semibold">Followers:</span> {followers.toLocaleString()}
                        </div>
                        <div>
                            <span className="font-semibold">Engagement Rate:</span> {engagementRate}%
                        </div>
                        <div>
                            <span className="font-semibold">Average Likes:</span> {avgLikes.toLocaleString()}
                        </div>
                        <div>
                            <span className="font-semibold">Average Comments:</span> {avgComments.toLocaleString()}
                        </div>
                    </div>
                    {/* Topics and Platforms */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <span className="font-semibold">Topics:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {topics && topics.length > 0
                                    ? topics.map((topic) => (
                                        <span
                                            key={topic}
                                            className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
                                        >
                                            {topic}
                                        </span>
                                    ))
                                    : <span className="ml-2 text-gray-500">N/A</span>}
                            </div>
                        </div>
                        <div>
                            <span className="font-semibold">Platforms:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {platform && platform.length > 0
                                    ? platform.map((platform) => (
                                        <span
                                            key={platform}
                                            className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1"
                                        >
                                            {platformIcons[platform] || platform}
                                            <span>{platform}</span>
                                        </span>
                                    ))
                                    : <span className="ml-2 text-gray-500">N/A</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}