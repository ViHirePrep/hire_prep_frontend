import { useState, useEffect } from 'react';

import VideoAnswer from './VideoAnswer';

import Button from '@/components/system/Button';
import Textarea from '@/components/system/Textarea';
import { useToast } from '@/lib/hooks/useToast';

interface Question {
    id: string;
    questionText: string;
    questionType: 'TEXT' | 'VIDEO';
    timeLimit: number;
    order: number;
}

interface InterviewSessionProps {
    sessionId: string;
    questions: Question[];
    onComplete: () => void;
}

const MicIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

export default function InterviewSession({
    sessionId,
    questions,
    onComplete,
}: InterviewSessionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string, any>>(new Map());
    const [timeRemaining, setTimeRemaining] = useState(0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [totalTime, setTotalTime] = useState(0);
    const [textAnswer, setTextAnswer] = useState('');
    const [sortedQuestions, setSortedQuestions] = useState<Question[]>([]);
    const [isSavingAnswer, setIsSavingAnswer] = useState(false);

    const { error: showError } = useToast();

    // Reset text answer when question changes
    useEffect(() => {
        if (sortedQuestions.length > 0 && sortedQuestions[currentIndex]) {
            setTextAnswer('');
        }
    }, [currentIndex, sortedQuestions]);

    useEffect(() => {
        if (questions && questions.length > 0) {
            const sorted = [...questions].sort((a, b) => a.order - b.order);
            const total = sorted.reduce(
                (sum, question) => sum + question.timeLimit * 60,
                0,
            );

            setSortedQuestions(sorted);
            setTotalTime(total);
            setTimeRemaining(total);
        }
    }, [questions]);

    useEffect(() => {
        if (timeRemaining <= 0 && sortedQuestions.length > 0) {
            handleSessionComplete();

            return;
        }

        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeRemaining, sortedQuestions.length]);

    const saveAnswer = async (questionId: string, answerData: any) => {
        try {
            const payload: any = {
                sessionId,
                questionId,
            };

            if (answerData.type === 'text') {
                payload.candidateAnswerText = answerData.data;
            } else {
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/interview-answer/save-answer`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(payload),
                },
            );

            if (!response.ok) {
                throw new Error(
                    (await response.json().catch(() => ({})))?.message ||
                        'Failed to save answer. Please try again.',
                );
            }
        } catch (err: any) {
            showError(
                err?.message || 'Failed to save answer. Please try again.',
            );
        }
    };

    const handleNext = async () => {
        setIsSavingAnswer(true);
        const currentQuestion = sortedQuestions[currentIndex];
        let answerToSave = null;

        if (
            currentQuestion &&
            currentQuestion.questionType === 'TEXT' &&
            textAnswer.trim()
        ) {
            answerToSave = {
                type: 'text',
                data: textAnswer,
                questionId: currentQuestion.id,
            };
        } else if (
            currentQuestion &&
            currentQuestion.questionType === 'VIDEO'
        ) {
            answerToSave = answers.get(currentQuestion.id);
        }

        if (answerToSave) {
            await saveAnswer(currentQuestion.id, answerToSave);
        }
        if (currentIndex < sortedQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            await submitAnswers();
            onComplete();
        }
        setIsSavingAnswer(false);
    };

    const handleSessionComplete = async () => {
        await submitAnswers();
        onComplete();
    };

    const submitAnswers = async () => {
        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/interview-answer/submit`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ sessionId }),
                    credentials: 'include',
                },
            );
        } catch (err) {
            showError(
                `Error submitting answers: ${err instanceof Error ? err.message : String(err)}`,
            );
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleVideoAnswer = (answer: any) => {
        setAnswers((prev) => {
            const newAnswers = new Map(prev);
            newAnswers.set(answer.questionId, {
                type: 'video',
                data: answer.data,
                questionId: answer.questionId,
            });
            return newAnswers;
        });
    };

    if (sortedQuestions.length === 0 || !sortedQuestions[currentIndex]) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-500 font-medium">
                        Preparing your interview...
                    </p>
                </div>
            </div>
        );
    }

    const currentQuestion = sortedQuestions[currentIndex];
    const progress = ((currentIndex + 1) / sortedQuestions.length) * 100;
    const isLastQuestion = currentIndex === sortedQuestions.length - 1;
    const isUrgent = timeRemaining < 300;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 flex-none z-20 px-6 py-4 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                        Progress
                    </span>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold text-gray-900 leading-none">
                            {currentIndex + 1}
                        </span>
                        <span className="text-sm text-gray-400 font-medium">
                            / {sortedQuestions.length}
                        </span>
                    </div>
                </div>

                <div className="hidden md:block flex-1 mx-12 max-w-2xl">
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                            className="bg-primary h-full transition-all duration-700 ease-in-out rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div
                    className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border ${
                        isUrgent
                            ? 'bg-red-50/50 border-red-100 text-red-600'
                            : 'bg-gray-50/50 border-gray-100 text-gray-600'
                    } transition-colors duration-300 font-mono`}
                >
                    <ClockIcon
                        className={`w-4 h-4 ${isUrgent ? 'animate-pulse' : ''}`}
                    />
                    <span className="font-bold text-lg tabular-nums tracking-tight">
                        {formatTime(timeRemaining)}
                    </span>
                </div>
            </header>

            {/* Main Body */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
                {/* Left: Persistent Video Panel */}
                <div className="flex-5 bg-gray-50 border-r border-gray-200 flex flex-col p-8 lg:p-10 justify-center relative overflow-hidden order-last lg:order-first">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                    <div className="relative z-10 w-full max-w-lg mx-auto flex flex-col gap-6">
                        <div className="bg-white p-2 rounded-xl shadow-lg shadow-gray-200/50 border border-gray-100">
                            <VideoAnswer
                                key="persistent-video-recorder"
                                questionId={currentQuestion.id}
                                autoRecord={
                                    currentQuestion.questionType === 'VIDEO'
                                }
                                enablePreview={true}
                                hideControls={
                                    currentQuestion.questionType === 'TEXT'
                                }
                                onAnswer={handleVideoAnswer}
                            />
                        </div>

                        {/* Status Indicator */}
                        <div className="flex items-center justify-center gap-3">
                            <div
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase ${
                                    currentQuestion.questionType === 'VIDEO'
                                        ? 'bg-red-50 text-red-600 ring-1 ring-red-100'
                                        : 'bg-green-50 text-green-600 ring-1 ring-green-100'
                                }`}
                            >
                                <div
                                    className={`w-2 h-2 rounded-full ${
                                        currentQuestion.questionType === 'VIDEO'
                                            ? 'bg-red-500 animate-pulse'
                                            : 'bg-green-500'
                                    }`}
                                ></div>
                                {currentQuestion.questionType === 'VIDEO'
                                    ? 'Recording'
                                    : 'Camera Ready'}
                            </div>
                        </div>

                        {/* Quick Tips or Info */}
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 text-center">
                            <h4 className="text-sm font-semibold text-gray-900 mb-2">
                                Interview Tips
                            </h4>
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {currentQuestion.questionType === 'VIDEO'
                                    ? 'Maintain eye contact with the camera. Speak clearly and confidently.'
                                    : 'Take your time to structure your thoughts before typing. Quality over quantity.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex-7 flex flex-col h-full overflow-y-auto bg-white relative z-10">
                    <div className="max-w-4xl mx-auto w-full p-6 md:p-8 lg:p-10 flex flex-col h-full">
                        <div className="mb-3 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            <h1 className="text-2xl lg:text-2xl font-bold text-gray-900 leading-[1.2] tracking-tight">
                                {currentQuestion.questionText}
                            </h1>
                            <p className="text-gray-500 text-base font-medium leading-relaxed">
                                {currentQuestion.questionType === 'VIDEO'
                                    ? 'This is a video response question. Please record your answer.'
                                    : 'This is a text response question. Please type your answer below.'}
                            </p>
                        </div>

                        <div className="h-px w-full bg-gray-100 mb-3 flex items-center gap-4">
                            <div className="h-1 w-1 rounded-full bg-gray-200"></div>
                            <div className="h-1 w-1 rounded-full bg-gray-200"></div>
                            <div className="h-1 w-1 rounded-full bg-gray-200"></div>
                        </div>

                        {/* Input Area */}
                        <div className="flex-1 min-h-[50vh] flex flex-col relative group">
                            {currentQuestion.questionType === 'TEXT' ? (
                                <div className="flex flex-col h-full bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-300 focus-within:border-primary/50 focus-within:bg-gray-50/30 transition-all duration-300">
                                    <div className="flex-1 px-6 h-full pt-6 pb-2 relative overflow-hidden">
                                        <Textarea
                                            value={textAnswer}
                                            onChange={(e) =>
                                                setTextAnswer(e.target.value)
                                            }
                                            placeholder="Start typing your thoughts here..."
                                            containerClassName="h-full"
                                            className="w-full h-full resize-none border-0 focus:ring-0 p-0 text-lg leading-relaxed placeholder:text-gray-300 bg-transparent font-medium text-gray-700"
                                        />
                                    </div>
                                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100/50 shrink-0">
                                        <Button
                                            variant="outline"
                                            disabled={true}
                                            className="gap-2 text-gray-400 border-gray-200 bg-transparent hover:bg-gray-50 px-4 py-2 h-auto text-xs font-semibold uppercase tracking-wider opacity-60 cursor-not-allowed"
                                        >
                                            <MicIcon className="w-3.5 h-3.5" />
                                            <span>Record Voice</span>
                                        </Button>
                                        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                            {textAnswer.length} characters
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/30 text-gray-400">
                                    <div className="text-center space-y-2">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                                            <svg
                                                className="w-6 h-6 text-gray-300"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="font-medium">
                                            Video Recording Active on Left Panel
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between shrink-0">
                            <div className="text-sm text-gray-400 font-medium hidden sm:block">
                                {isLastQuestion
                                    ? 'Final Step'
                                    : 'Press Next to continue'}
                            </div>
                            <Button
                                onClick={handleNext}
                                isLoading={isSavingAnswer}
                                disabled={isSavingAnswer}
                                className="px-12 py-4 text-base font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 rounded-xl"
                            >
                                {isLastQuestion
                                    ? 'Submit Interview'
                                    : 'Next Question'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
