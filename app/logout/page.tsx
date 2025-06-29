'use client';
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";


export const Logout = () => {


    useEffect(() => {
        signOut();
    }, []);

}