import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import DeviceTest from '@/components/features/interview/DeviceTest';
import InterviewSession from '@/components/features/interview/InterviewSession';
import { getCurrentUser } from '@/lib/api';

type InterviewStage = 'loading' | 'device-test' | 'interview' | 'complete';

interface SessionData {
    id: string;
    interviewQuestions: Array<{
        id: string;
        questionText: string;
        questionType: 'TEXT' | 'VIDEO';
        timeLimit: number;
        order: number;
    }>;
    totalTime: number;
}

export default function InterviewSessionPage() {
    const router = useRouter();
    const { sessionId } = router.query;
    const [stage, setStage] = useState<InterviewStage>('loading');
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuthAndFetch = async () => {
            try {
                const user = getCurrentUser();

                if (!user) {
                    router.push('/login');

                    return;
                }

                setIsCheckingAuth(false);

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
                setStage('device-test');
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'An error occurred',
                );
                setStage('loading');
            }
        };

        checkAuthAndFetch();
    }, [sessionId, router]);

    const handleDeviceTestComplete = () => {
        setStage('interview');
    };

    const handleInterviewComplete = () => {
        // Instead of setting stage to complete, redirect to the result page
        if (sessionId) {
            router.push(`/interview/session/${sessionId}/result`);
        }
    };

    if (stage === 'loading' || isCheckingAuth) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-700">
                        {isCheckingAuth
                            ? 'Checking authentication...'
                            : 'Loading interview session...'}
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

    if (stage === 'device-test' && sessionData) {
        return <DeviceTest onComplete={handleDeviceTestComplete} />;
    }

    if (stage === 'interview' && sessionData) {
        return (
            <InterviewSession
                sessionId={sessionData.id}
                questions={sessionData.interviewQuestions}
                onComplete={handleInterviewComplete}
            />
        );
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
