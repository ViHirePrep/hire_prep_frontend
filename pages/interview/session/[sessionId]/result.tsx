import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { getCurrentUser } from '@/lib/api';
import InterviewComplete from '@/components/features/interview/InterviewComplete';

export default function InterviewResultPage() {
    const router = useRouter();
    const { sessionId } = router.query;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sessionData, setSessionData] = useState<any>(null);

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            try {
                const user = getCurrentUser();

                if (!user) {
                    router.push('/login');

                    return;
                }

                if (!sessionId) return;

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/interview-sessions/${sessionId}`,
                    { credentials: 'include' },
                );

                if (!response.ok) {
                    throw new Error('Session does not exist or access denied');
                }

                const data = await response.json();

                setSessionData(data);
                setLoading(false);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'An error occurred',
                );
                setLoading(false);
            }
        };

        checkAuthAndFetch();
    }, [sessionId, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-700">
                        Loading interview results...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">
                        Error
                    </h1>
                    <p className="text-gray-700">{error}</p>
                </div>
            </div>
        );
    }

    if (sessionData && sessionId) {
        return <InterviewComplete sessionId={sessionId as string} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <p className="text-gray-700">
                    Something went wrong. Please try again.
                </p>
            </div>
        </div>
    );
}
