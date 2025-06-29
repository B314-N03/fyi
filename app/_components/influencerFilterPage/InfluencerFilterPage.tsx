'use client';

import { useState, useMemo } from "react";
import "./influencer_filter_page.css"
import { useSession } from "next-auth/react";
import InfluencerBox from "../influencerBox/InfluencerBox";
type Influencer = {
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
    avatarImageLink: string;
};

type Props = {
    influencers: Influencer[];
    favoriteIds: string[];
};

export default function InfluencerFilterPage({ influencers, favoriteIds }: Props) {
    const { data: session } = useSession();
    const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);
    const userId = session?.user?.id || "";
    const [filters, setFilters] = useState({
        name: "",
        gender: "",
        platform: "",
        topic: "",
        location: "",
        minFollowers: "",
        avgLikes: "",
        avgComments: "",
        engagementRate: "",
    });

    const clearFilterBtnDisabled = useMemo(() => {
        return !filters.name && !filters.gender && !filters.platform && !filters.topic && !filters.location && !filters.minFollowers && !filters.avgLikes && !filters.avgComments && !filters.engagementRate;
    }, [filters]);

    // Unique values for selects
    const genders = useMemo(() => Array.from(new Set(influencers.map(i => i.gender))).sort(), [influencers]);
    const platforms = useMemo(() => Array.from(new Set(influencers.flatMap(i => i.platform))).sort(), [influencers]);
    const topics = useMemo(() => Array.from(new Set(influencers.flatMap(i => i.topics))).sort(), [influencers]);
    const locations = useMemo(() => Array.from(new Set(influencers.map(i => i.location))).sort(), [influencers]);
    // Filtering logic
    const filtered = useMemo(() => {
        return influencers.filter(i => {
            if (filters.name && !i.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
            if (filters.gender && i.gender !== filters.gender) return false;
            if (filters.platform && !i.platform.includes(filters.platform)) return false;
            if (filters.topic && !i.topics.includes(filters.topic)) return false;
            if (filters.location && i.location !== filters.location) return false;
            if (filters.minFollowers && i.followers < Number(filters.minFollowers)) return false;
            if (filters.avgLikes && i.avgLikes < Number(filters.avgLikes)) return false;
            if (filters.avgComments && i.avgComments < Number(filters.avgComments)) return false;
            if (filters.engagementRate && i.followers > Number(filters.engagementRate)) return false;
            return true;
        });
    }, [influencers, filters]);

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearAllFilters = () => {
        setFilters({
            name: "",
            gender: "",
            platform: "",
            topic: "",
            location: "",
            minFollowers: "",
            avgLikes: "",
            avgComments: "",
            engagementRate: "",
        });
    }

    return (
        <div className="flex flex-col gap-3">
            <h1>Find your Influencer</h1>
            <form className="mb-4 flex flex-wrap gap-2 items-end" onSubmit={e => e.preventDefault()}>
                <input name="name" placeholder="Name" className="styledFilterInput" value={filters.name} onChange={handleChange} />
                <input name="gender" list="gender-list" placeholder="Gender" className="styledFilterInput" value={filters.gender} onChange={handleChange} />
                <datalist id="gender-list" className="styledDatalist">
                    {genders.map(g => <option key={g} value={g} />)}
                </datalist>

                <input name="platform" list="platform-list" placeholder="Platform" className="styledFilterInput" value={filters.platform} onChange={handleChange} />
                <datalist id="platform-list">
                    {platforms.map(p => <option key={p} value={p} />)}
                </datalist>

                <input name="topic" list="topic-list" placeholder="Topic" className="styledFilterInput" value={filters.topic} onChange={handleChange} />
                <datalist id="topic-list">
                    {topics.map(t => <option key={t} value={t} />)}
                </datalist>

                <input name="location" list="location-list" placeholder="Location" className="styledFilterInput" value={filters.location} onChange={handleChange} />
                <datalist id="location-list">
                    {locations.map(l => <option key={l} value={l} />)}
                </datalist>
                <button className="styledFilterButton" onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}>{showAdditionalFilters ? "Hide" : "Show"} Additional Filters</button>
                <button disabled={clearFilterBtnDisabled} className="styledFilterButton" onClick={clearAllFilters}>Clear Filters</button>
                {showAdditionalFilters && (
                    <div className="flex flex-wrap gap-2">
                        <input name="minFollowers" type="number" placeholder="Min Followers" className="styledFilterInput" value={filters.minFollowers} onChange={handleChange} />
                        <input name="avgLikes" type="number" placeholder="Min Avg Likes" className="styledFilterInput" value={filters.avgLikes} onChange={handleChange} />
                        <input name="avgComments" type="number" placeholder="Min Avg Comments" className="styledFilterInput" value={filters.avgComments} onChange={handleChange} />
                        <input name="engagementRate" type="number" placeholder="Max Engagement Rate" className="styledFilterInput" value={filters.engagementRate} onChange={handleChange} />
                    </div>
                )}
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((influencer) => (
                    <InfluencerBox
                        key={influencer.id}
                        isFavorited={favoriteIds.includes(influencer.id)}
                        userId={userId}
                        {...influencer}
                    />
                ))}
            </div>
        </div>
    );
}