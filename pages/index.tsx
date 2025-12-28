import { useEffect, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

import { Button } from '@/components/system';
import { getCurrentUser } from '@/lib/api';

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        setUser(getCurrentUser());

        const handleStorage = () => setUser(getCurrentUser());
        const handleAuthEvent = () => setUser(getCurrentUser());

        window.addEventListener('storage', handleStorage);
        window.addEventListener('auth-changed', handleAuthEvent);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('auth-changed', handleAuthEvent);
        };
    }, []);

    return (
        <>
            <Head>
                <title>HirePrep - Ace your next interview</title>
                <meta
                    name="description"
                    content="Practice interviews and get ready faster"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>

            <section className="relative space-y-24 py-16">
                {/* Background gradient mesh */}
                <div className="gradient-mesh fixed inset-0 -z-10"></div>

                <div className="mx-auto max-w-3xl space-y-6 text-center animate-bounce-in">
                    <h1 className="text-5xl font-bold tracking-tight text-foreground">
                        AI Interview - Prepare for Success
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Create AI interviews, receive detailed feedback and
                        improve your skills.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-4">
                        <Button
                            size="lg"
                            onClick={() => {
                                const user = getCurrentUser();

                                if (!user) {
                                    router.push('/login');
                                } else {
                                    router.push('/interview/create');
                                }
                            }}
                            className="shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                        >
                            Create Interview Session
                        </Button>
                        {!user && (
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={() => router.push('/login')}
                            >
                                Sign In
                            </Button>
                        )}
                    </div>
                </div>

                <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
                    <div className="group space-y-3 rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50 animate-emerge-up">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white shadow-md animate-float">
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-base font-semibold text-foreground">
                            AI Interview
                        </h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            Create AI interviews, receive questions tailored to
                            the position you're applying for.
                        </p>
                    </div>
                    <div
                        className="group space-y-3 rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50 animate-emerge-up"
                        style={{ animationDelay: '0.1s' }}
                    >
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white shadow-md animate-float"
                            style={{ animationDelay: '0.5s' }}
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-base font-semibold text-foreground">
                            Detailed Feedback
                        </h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            AI scores and evaluates your answers, providing
                            specific feedback.
                        </p>
                    </div>
                    <div
                        className="group space-y-3 rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-primary/50 animate-emerge-up"
                        style={{ animationDelay: '0.2s' }}
                    >
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-white shadow-md animate-float"
                            style={{ animationDelay: '1s' }}
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-base font-semibold text-foreground">
                            Instant Results
                        </h2>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                            View scores, strengths, weaknesses and improvement
                            suggestions after completion.
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}
