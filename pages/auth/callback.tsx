import { useEffect } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import { authService } from '@/lib/services/auth.service';

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        const { user, error } = router.query;

        if (error) {
            router.push('/login?error=auth_failed');

            return;
        }

        if (user) {
            try {
                const userData = JSON.parse(user as string);

                authService.setCurrentUser(userData);

                router.push('/');
            } catch {
                router.push('/login?error=auth_failed');
            }
        }
    }, [router]);

    return (
        <>
            <Head>
                <title>Authenticating... - HirePrep</title>
            </Head>

            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                    <h2 className="text-xl font-semibold">Signing you in...</h2>
                    <p className="mt-2 text-sm text-zinc-600">
                        Please wait a moment
                    </p>
                </div>
            </div>
        </>
    );
}
