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
        recommendations: string[];
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
                    recommendations: data.recommendations || [],
                    overallFeedback:
                        typeof data.detailedFeedback === 'string'
                            ? data.detailedFeedback
                            : '',
                },
                questions: Array.isArray(data.detailedFeedback)
                    ? data.detailedFeedback.map((feedback: any) => ({
                          questionText:
                              feedback.questionText ||
                              `Question for ${feedback.questionId || 'unknown'}`,
                          candidateAnswer:
                              feedback.candidateAnswer ||
                              'Answer provided by candidate',
                          expectedAnswer:
                              feedback.expectedAnswer || 'Expected answer',
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
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-2">
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Interview Completed
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        Great job finishing the session! Here is your
                        AI-generated performance breakdown.
                    </p>
                </div>

                {/* Score Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                    <div className="p-8 md:p-12 flex flex-col items-center justify-center bg-linear-to-b from-primary/5 to-transparent">
                        <div className="relative">
                            <svg
                                className="w-48 h-48 transform -rotate-90"
                                viewBox="0 0 100 100"
                            >
                                <circle
                                    className="text-gray-200"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                />
                                <circle
                                    className="text-primary transition-all duration-1000 ease-out"
                                    strokeWidth="8"
                                    strokeDasharray={`${2 * Math.PI * 40}`}
                                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - (summary?.totalScore || 0) / 100)}`}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                />
                            </svg>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <span className="text-5xl font-bold text-gray-900">
                                    {summary?.totalScore || 0}
                                </span>
                                <span className="block text-sm text-gray-500 font-medium uppercase tracking-wider mt-1">
                                    Score
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Feedback Grid */}
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 border-t border-gray-100">
                        <div className="p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-green-100 text-green-700">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                        />
                                    </svg>
                                </span>
                                Key Strengths
                            </h3>
                            <ul className="space-y-4">
                                {summary?.strengths?.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                                        <span className="text-gray-600 leading-relaxed">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-8">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <span className="p-1.5 rounded-lg bg-orange-100 text-orange-700">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                        />
                                    </svg>
                                </span>
                                Areas for Improvement
                            </h3>
                            <ul className="space-y-4">
                                {summary?.weaknesses?.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-3"
                                    >
                                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                        <span className="text-gray-600 leading-relaxed">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Recommendations Section */}
                    {summary?.recommendations &&
                        summary.recommendations.length > 0 && (
                            <div className="border-t border-gray-100 p-8 bg-gray-50/30">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                                        <svg
                                            className="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                            />
                                        </svg>
                                    </span>
                                    Recommended Actions
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {summary.recommendations.map(
                                        (item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-3 bg-white p-4 rounded-xl border border-blue-100/50 shadow-sm"
                                            >
                                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold shrink-0 mt-0.5">
                                                    {idx + 1}
                                                </span>
                                                <p className="text-gray-700 text-sm leading-relaxed">
                                                    {item}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                </div>

                {/* Detailed Analysis */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 px-1">
                        Detailed Question Analysis
                    </h2>
                    <div className="grid gap-6">
                        {result.questions?.map((q, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-4 mb-6">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 text-gray-600 font-bold text-sm shrink-0">
                                        {idx + 1}
                                    </span>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-2">
                                            {q.questionText}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    q.score >= 80
                                                        ? 'bg-green-100 text-green-800'
                                                        : q.score >= 60
                                                          ? 'bg-yellow-100 text-yellow-800'
                                                          : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                Score: {q.score}/100
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 bg-gray-50/50 rounded-xl p-5 border border-gray-100/50">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                Your Response
                                            </p>
                                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                                                {q.candidateAnswer}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                Suggested Answer
                                            </p>
                                            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap opacity-80">
                                                {q.expectedAnswer}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200/60 pt-4">
                                        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1">
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            AI Feedback
                                        </p>
                                        <p className="text-gray-600 text-sm leading-relaxed italic">
                                            {q.feedback}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Rating Section - Fixed Bottom or Inline? Inline is better for flow */}
                {!submitted ? (
                    <div className="bg-white rounded-3xl p-8 border border-gray-200 text-center max-w-2xl mx-auto shadow-sm">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            How was your interview experience?
                        </h3>
                        <p className="text-gray-500 mb-6 text-sm">
                            Your feedback helps us improve the platform for
                            everyone.
                        </p>

                        <div className="flex justify-center gap-3 mb-8">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => setRating(star)}
                                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                >
                                    <svg
                                        className={`w-10 h-10 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4 max-w-lg mx-auto">
                            <Textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                rows={3}
                                placeholder="Any additional comments? (Optional)"
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            />
                            <Button
                                onClick={handleSubmitFeedback}
                                disabled={rating === 0}
                                className="w-full rounded-xl py-3 text-base shadow-lg shadow-primary/20"
                            >
                                Submit Feedback
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-green-50 rounded-2xl p-8 text-center border border-green-100 max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg
                                className="w-8 h-8"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Thank you!
                        </h3>
                        <p className="text-gray-600">
                            Your feedback has been submitted successfully.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
