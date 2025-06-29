'use client'
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Header() {
    
    const { data: session } = useSession();
    const email = session?.user?.email || "";
    const avatarLetter = email.charAt(0).toUpperCase() || "";
    const pathaname = usePathname();
    if (pathaname === "/") return null;

    return (
        <div className="h-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex flex-row justify-between items-center px-8 shadow-md">

            <div className="flex items-center">
                <Link href="/influencer" className="text-white text-2xl font-bold tracking-wide">fyi</Link>
            </div>

            <div className="flex gap-6">
                <Link href="/influencer" className="text-white font-medium hover:underline">Find Influencer</Link>
                <Link href="/favorites" className="text-white font-medium hover:underline">Favorites</Link>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-indigo-600 font-bold text-lg border-2 border-indigo-400">
                    {avatarLetter}
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded hover:bg-indigo-100 transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );

}