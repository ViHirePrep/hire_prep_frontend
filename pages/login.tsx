import { useRouter } from 'next/router';
import Head from 'next/head';

import LoginForm from '@/components/features/auth/LoginForm';

export default function LoginPage() {
    const router = useRouter();
    const { error } = router.query;

    return (
        <>
            <Head>
                <title>Sign In - HirePrep</title>
            </Head>

            <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
                <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8">
                    <div className="space-y-3 text-center">
                        <h1 className="text-3xl font-semibold">
                            Welcome to HirePrep
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Sign in with your Google account to continue
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-lg border border-danger bg-danger-light px-4 py-3 text-sm text-danger">
                            Authentication failed. Please try again.
                        </div>
                    )}

                    <LoginForm />
                </div>
            </div>
        </>
    );
}
