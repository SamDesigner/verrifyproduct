"use client";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/router";
import {useEffect} from "react";

export default function ProtectedRoute({children}:{children:React.ReactNode}){
    const user = useAuthStore((state)=>state.user);
    const router = useRouter();

    useEffect(()=>{
        if(!user){
            router.push('/login')
        }
    }, [user,router])

    if(!user) return null;
    return <>{children}</>
}