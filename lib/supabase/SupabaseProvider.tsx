"use client";

import { useSession } from "@clerk/nextjs";
import { createContext, useContext, useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
// import { Exo } from "next/font/google";

type SupabaseContext = {
    supabase : SupabaseClient | null;
    isLoaded :boolean;
}

const Context = createContext<SupabaseContext>({
    supabase : null,
    isLoaded:false,
});


export default function SupabaseProvide({
    children,
}:{
    children: React.ReactNode;
}){
    const {session, isLoaded: isSessionLoaded} = useSession();
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(()=>{
        if (!isSessionLoaded) return;

        if (!session) {
            setSupabase(null);
            setIsLoaded(true);
            return;
        }

        setIsLoaded(false);
        const client = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        accessToken: async () => session.getToken(),
      }
        );

        setSupabase(client);
        setIsLoaded(true);
    },[session, isSessionLoaded])

    return (
        <Context.Provider value={{supabase, isLoaded}} >
            {children}
        </Context.Provider>
    );

}

export const useSupabase = ( ) =>{
    const context = useContext(Context);
    if(context === undefined){
        throw new Error("useSupabase needs to be inside the provider");
    }
    return context;
}
