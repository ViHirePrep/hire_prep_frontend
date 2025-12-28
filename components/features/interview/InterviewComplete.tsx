import { useState, useEffect } from 'react';

import { useToast } from '@/lib/hooks/useToast';
import { api } from '@/lib/api';
import Button from '@/components/system/Button';
import Textarea from '@/components/system/Textarea';

interface InterviewCompleteProps {
    sessionId: string;
}

interface InterviewResult {
    status: 'processing' | 'complete';
    summary?: {
        totalScore: number;
        strengths: string[];
        weaknesses: string[];
        overallFeedback: string;
    };
    questions?: Array<{
        questionText: string;
        candidateAnswer: string;
        expectedAnswer: string;
        score: number;
        feedback: string;
    }>;
}

export default function InterviewComplete({
    sessionId,
}: InterviewCompleteProps) {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [result, setResult] = useState<InterviewResult | null>(null);
    const [loading, setLoading] = useState(true);
    const { error } = useToast();

    useEffect(() => {
        fetchResults();
        const interval = setInterval(() => {
            if (result?.status !== 'complete') {
                fetchResults();
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [sessionId]);

    const fetchResults = async () => {
        try {
            const data = await api.get(`/interview-summary/${sessionId}`);

            const transformedData: InterviewResult = {
                status: 'complete',
                summary: {
                    totalScore: Math.round(data.overallScore) || 0,
                    strengths: data.strengths || [],
                    weaknesses: data.weaknesses || [],
                    overallFeedback: Array.isArray(data.recommendations)
                        ? data.recommendations.join('\n')
                        : typeof data.detailedFeedback === 'string'
                          ? data.detailedFeedback
                          : '',
                },
                questions: Array.isArray(data.detailedFeedback)
                    ? data.detailedFeedback.map((feedback: any) => ({
                          questionText: `Question for ${feedback.questionId || 'unknown'}`,
                          candidateAnswer: 'Answer provided by candidate',
                          expectedAnswer: 'Expected answer',
                          score: Math.round(feedback.score) || 0,
                          feedback: feedback.feedback || '',
                      }))
                    : [],
            };

            setResult(transformedData);
            setLoading(false);
        } catch (err: any) {
            error(
                err?.message || 'Can not load results. Please try again later.',
            );
            setLoading(false);
        }
    };

    const handleSubmitFeedback = async () => {
        try {
            await api.post(`/interview-sessions/${sessionId}/feedback`, {
                rating,
                feedback,
            });
            setSubmitted(true);
        } catch (err: any) {
            error(err?.message || 'Failed to submit rating. Please try again!');
        }
    };

    if (loading || result?.status === 'processing') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Processing Results
                    </h2>
                    <p className="text-gray-600">
                        The system is scoring and evaluating your answers...
                    </p>
                </div>
            </div>
        );
    }

    if (!result || result.status !== 'complete') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">
                        Cannot load results. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    const { summary } = result;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Interview Complete!
                        </h1>
                        <p className="text-gray-600">
                            Thank you for participating. Below are your
                            evaluation results.
                        </p>
                    </div>

                    <div className="mb-8">
                        <div className="bg-linear-to-r from-primary to-accent rounded-lg p-8 text-white text-center mb-6">
                            <p className="text-sm uppercase tracking-wide mb-2">
                                Total Score
                            </p>
                            <p className="text-6xl font-bold">
                                {summary?.totalScore || 0}
                            </p>
                            <p className="text-sm mt-2">/ 100 points</p>
                        </div>

                        {summary && (
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                    <h3 className="font-semibold text-green-900 mb-3 flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Strengths
                                    </h3>
                                    <ul className="space-y-2">
                                        {summary.strengths.map(
                                            (strength, idx) => (
                                                <li
                                                    key={idx}
                                                    className="text-sm text-green-800"
                                                >
                                                    • {strength}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                    <h3 className="font-semibold text-yellow-900 mb-3 flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Areas to Improve
                                    </h3>
                                    <ul className="space-y-2">
                                        {summary.weaknesses.map(
                                            (weakness, idx) => (
                                                <li
                                                    key={idx}
                                                    className="text-sm text-yellow-800"
                                                >
                                                    • {weakness}
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {summary?.overallFeedback && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                                <h3 className="font-semibold text-blue-900 mb-3">
                                    Overall Feedback
                                </h3>
                                <p className="text-sm text-blue-800 leading-relaxed">
                                    {summary.overallFeedback}
                                </p>
                            </div>
                        )}
                    </div>

                    {result.questions && (
                        <div className="mb-8">
                            <h3 className="font-semibold text-gray-900 mb-4">
                                Question Details
                            </h3>
                            <div className="space-y-4">
                                {result.questions.map((q, idx) => (
                                    <div
                                        key={idx}
                                        className="border border-gray-200 rounded-lg p-6"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-semibold text-gray-900 flex-1">
                                                Question {idx + 1}:{' '}
                                                {q.questionText}
                                            </h4>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                                    q.score >= 80
                                                        ? 'bg-green-100 text-green-800'
                                                        : q.score >= 60
                                                          ? 'bg-yellow-100 text-yellow-800'
                                                          : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {q.score} points
                                            </span>
                                        </div>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <p className="font-medium text-gray-700 mb-1">
                                                    Your Answer:
                                                </p>
                                                <p className="text-gray-600">
                                                    {q.candidateAnswer}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700 mb-1">
                                                    Suggested Answer:
                                                </p>
                                                <p className="text-gray-600">
                                                    {q.expectedAnswer}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-700 mb-1">
                                                    Feedback:
                                                </p>
                                                <p className="text-gray-600">
                                                    {q.feedback}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {!submitted && (
                        <div className="border-t border-gray-200 pt-8">
                            <h3 className="font-semibold text-gray-900 mb-4">
                                Rate Your Interview Experience
                            </h3>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    How many stars would you rate?
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none"
                                        >
                                            <svg
                                                className={`w-10 h-10 ${
                                                    star <= rating
                                                        ? 'text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Feedback (optional)
                                </label>
                                <Textarea
                                    value={feedback}
                                    onChange={(e) =>
                                        setFeedback(e.target.value)
                                    }
                                    rows={4}
                                    placeholder="Share your interview experience..."
                                />
                            </div>

                            <Button
                                onClick={handleSubmitFeedback}
                                disabled={rating === 0}
                                className="w-full"
                            >
                                Submit Rating
                            </Button>
                        </div>
                    )}

                    {submitted && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                            <svg
                                className="w-16 h-16 text-green-600 mx-auto mb-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-green-800 font-semibold">
                                Thank you for your rating!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
