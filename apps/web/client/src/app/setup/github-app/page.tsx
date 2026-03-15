'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const MANIFEST = {
    name: 'Onlook',
    url: 'https://onlook.trajectralabs.dev',
    hook_attributes: { url: 'https://onlook.trajectralabs.dev/api/github/webhook' },
    redirect_url: 'https://onlook.trajectralabs.dev/callback/github/app-setup',
    callback_urls: ['https://onlook.trajectralabs.dev/callback/github/app-setup'],
    setup_url: 'https://onlook.trajectralabs.dev/callback/github/install',
    description: 'Visual editor for React apps — Onlook GitHub integration',
    public: false,
    default_permissions: {
        contents: 'write',
        metadata: 'read',
        pull_requests: 'write',
    },
    default_events: ['push', 'pull_request'],
};

export default function SetupGitHubApp() {
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        // Auto-submit after short delay so user sees the page
        const t = setTimeout(() => formRef.current?.submit(), 800);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <h1 className="text-xl font-semibold">Creating GitHub App...</h1>
                <p className="text-sm text-muted-foreground">
                    You will be redirected to GitHub to confirm the installation.
                </p>
                <form
                    ref={formRef}
                    method="post"
                    action="https://github.com/apps/manifests/new"
                    target="_self"
                >
                    <input type="hidden" name="manifest" value={JSON.stringify(MANIFEST)} />
                    <button
                        type="submit"
                        className="mt-2 px-4 py-2 bg-primary text-white rounded text-sm"
                    >
                        Create GitHub App on GitHub
                    </button>
                </form>
            </div>
        </div>
    );
}
