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
};

type Props = {
    influencers: Influencer[];
    favoriteIds: string[];
};

export default function InfluencerFilterPage({ influencers, favoriteIds }: Props) {
    const {data: session} = useSession();
    const userId = session?.user?.id || "";
    const [filters, setFilters] = useState({
        name: "",
        gender: "",
        platform: "",
        topic: "",
        location: "",
        minFollowers: "",
        maxFollowers: "",
    });

    const clearFilterBtnDisabled = useMemo(() => {
        return !filters.name && !filters.gender && !filters.platform && !filters.topic && !filters.location && !filters.minFollowers && !filters.maxFollowers;
    }, [filters]);
    
    // Unique values for selects
    const genders = useMemo(() => Array.from(new Set(influencers.map(i => i.gender))), [influencers]);
    const platforms = useMemo(() => Array.from(new Set(influencers.flatMap(i => i.platform))), [influencers]);
    const topics = useMemo(() => Array.from(new Set(influencers.flatMap(i => i.topics))), [influencers]);
    const locations = useMemo(() => Array.from(new Set(influencers.map(i => i.location))), [influencers]);

    // Filtering logic
    const filtered = useMemo(() => {
        return influencers.filter(i => {
            if (filters.name && !i.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
            if (filters.gender && i.gender !== filters.gender) return false;
            if (filters.platform && !i.platform.includes(filters.platform)) return false;
            if (filters.topic && !i.topics.includes(filters.topic)) return false;
            if (filters.location && i.location !== filters.location) return false;
            if (filters.minFollowers && i.followers < Number(filters.minFollowers)) return false;
            if (filters.maxFollowers && i.followers > Number(filters.maxFollowers)) return false;
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
            maxFollowers: "",
        });
    }

    return (
        <div className="flex flex-col gap-3">
            <h1>Find your Influencer</h1>
            <form className="mb-4 flex flex-wrap gap-2 items-end" onSubmit={e => e.preventDefault()}>
                <input name="name" placeholder="Name" className="styledFilterInput" value={filters.name} onChange={handleChange} />
                <select name="gender" className="styledFilterInput" value={filters.gender} onChange={handleChange}>
                    <option value="">Gender</option>
                    {genders.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <select name="platform" className="styledFilterInput" value={filters.platform} onChange={handleChange}>
                    <option value="">Platform</option>
                    {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <select name="topic" className="styledFilterInput" value={filters.topic} onChange={handleChange}>
                    <option value="">Topic</option>
                    {topics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <select name="location" className="styledFilterInput" value={filters.location} onChange={handleChange}>
                    <option value="">Location</option>
                    {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <input name="minFollowers" type="number" placeholder="Min Followers" className="styledFilterInput" value={filters.minFollowers} onChange={handleChange} />
                <input name="maxFollowers" type="number" placeholder="Max Followers" className="styledFilterInput" value={filters.maxFollowers} onChange={handleChange} />
                <button disabled={clearFilterBtnDisabled} className="styledFilterButton" onClick={clearAllFilters}>Clear Filters</button>
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