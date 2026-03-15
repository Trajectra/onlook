"use client";

import { env } from "@/env";
import { api } from "@/trpc/react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

let gleapSingleton: any | null = null;

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
    const { data: user } = api.user.get.useQuery();
    const pathname = usePathname();

    useEffect(() => {
        (async () => {
            try {
                const mod = await import("gleap");
                gleapSingleton = mod.default ?? mod;
                gleapSingleton.initialize(env.NEXT_PUBLIC_GLEAP_API_KEY);
            } catch (e) {
                console.warn("Gleap init failed", e);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const Gleap = gleapSingleton ?? (await import("gleap")).default;
                if (user) {
                    const name = user.displayName || [user.firstName, user.lastName].filter(Boolean).join(" ");
                    Gleap.identify(user.id, { name, email: user.email });
                } else {
                    Gleap.clearIdentity();
                }
            } catch {}
        })();
    }, [user]);

    useEffect(() => {
        (async () => {
            try {
                const Gleap = gleapSingleton ?? (await import("gleap")).default;
                if (Gleap?.getInstance?.()?.softReInitialize) {
                    Gleap?.getInstance()?.softReInitialize();
                }
            } catch {}
        })();
    }, [pathname]);

    return <>{children}</>;
}
