'use client';

import { api } from '@/trpc/react';
import { Routes } from '@/utils/constants';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type State = 'loading' | 'writing' | 'success' | 'error';

export default function GitHubAppSetupCallback() {
    const router = useRouter();
    const params = useSearchParams();
    const [state, setState] = useState<State>('loading');
    const [msg, setMsg] = useState('');
    const [creds, setCreds] = useState<{ appId: string; slug: string; privateKey: string } | null>(null);

    const convertMutation = api.github.convertAppManifest.useMutation();

    useEffect(() => {
        const code = params.get('code');
        if (!code) {
            setState('error');
            setMsg('No code parameter received from GitHub.');
            return;
        }

        convertMutation.mutate({ code }, {
            onSuccess: (data) => {
                setCreds({ appId: data.appId, slug: data.slug, privateKey: data.privateKey });
                setState('success');
            },
            onError: (err) => {
                setState('error');
                setMsg(err.message);
            },
        });
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-6">
            <div className="w-full max-w-lg space-y-4 text-center">
                {state === 'loading' && (
                    <>
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                        <h1 className="text-xl font-semibold">Setting up GitHub App...</h1>
                    </>
                )}

                {state === 'success' && creds && (
                    <>
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white text-2xl">✓</div>
                        <h1 className="text-xl font-semibold">GitHub App Created!</h1>
                        <p className="text-sm text-muted-foreground">
                            Add these values to your server <code>.env</code> file, then rebuild.
                        </p>
                        <div className="text-left bg-muted rounded p-4 text-xs font-mono space-y-1 break-all">
                            <div>GITHUB_APP_ID=&quot;{creds.appId}&quot;</div>
                            <div>GITHUB_APP_SLUG=&quot;{creds.slug}&quot;</div>
                            <div className="whitespace-pre-wrap">GITHUB_APP_PRIVATE_KEY=&quot;{creds.privateKey.replace(/\n/g, '\\n')}&quot;</div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Run on server: <code>nano /root/onlook/apps/web/client/.env</code>
                        </p>
                        <button
                            onClick={() => router.push(Routes.PROJECTS)}
                            className="mt-2 px-4 py-2 bg-primary text-white rounded text-sm"
                        >
                            Go to Projects
                        </button>
                    </>
                )}

                {state === 'error' && (
                    <>
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto text-white text-2xl">✗</div>
                        <h1 className="text-xl font-semibold">Setup Failed</h1>
                        <p className="text-sm text-red-400">{msg}</p>
                        <button
                            onClick={() => router.push(Routes.SETUP_GITHUB_APP)}
                            className="mt-2 px-4 py-2 bg-primary text-white rounded text-sm"
                        >
                            Try Again
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
