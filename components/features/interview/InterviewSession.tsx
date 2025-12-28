import { useState, useEffect, useRef } from 'react';

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

export default function InterviewSession({
    sessionId,
    questions,
    onComplete,
}: InterviewSessionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string, any>>(new Map());
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [textAnswer, setTextAnswer] = useState('');
    const [sortedQuestions, setSortedQuestions] = useState<Question[]>([]);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const streamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const { error: showError } = useToast();

    useEffect(() => {
        if (sortedQuestions.length > 0 && sortedQuestions[currentIndex]) {
            const current = sortedQuestions[currentIndex];

            setTextAnswer('');

            if (current.questionType === 'VIDEO') {
                initializeRecording();
            }
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

    // Timer for total session time - single countdown for entire session
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

    const initializeRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            showError(
                `Error initializing recording: ${err instanceof Error ? err.message : String(err)}`,
            );
        }
    };

    const startRecording = () => {
        if (!streamRef.current) return;

        recordedChunksRef.current = [];

        const mediaRecorder = new MediaRecorder(streamRef.current, {
            mimeType: 'video/webm;codecs=vp9',
        });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.start();
        mediaRecorderRef.current = mediaRecorder;
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            const blob = new Blob(recordedChunksRef.current, {
                type: 'video/webm',
            });

            const newAnswers = new Map(answers);

            const currentQuestion = sortedQuestions[currentIndex];

            if (currentQuestion) {
                newAnswers.set(currentQuestion.id, {
                    type: 'video',
                    data: blob,
                    questionId: currentQuestion.id,
                });
                setAnswers(newAnswers);
            }
        }
    };

    const handleNext = async () => {
        const currentQuestion = sortedQuestions[currentIndex];

        if (
            currentQuestion &&
            currentQuestion.questionType === 'TEXT' &&
            textAnswer.trim()
        ) {
            const newAnswers = new Map(answers);

            newAnswers.set(currentQuestion.id, {
                type: 'text',
                data: textAnswer,
                questionId: currentQuestion.id,
            });
            setAnswers(newAnswers);
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }

        if (currentIndex < sortedQuestions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            await submitAnswers();
            onComplete();
        }
    };

    const handleSessionComplete = async () => {
        await submitAnswers();
        onComplete();
    };

    const submitAnswers = async () => {
        const formData = new FormData();

        formData.append('sessionId', sessionId);

        answers.forEach((answer, questionId) => {
            if (answer.type === 'video') {
                formData.append(
                    `answer_${questionId}`,
                    answer.data,
                    `${questionId}.webm`,
                );
            } else {
                formData.append(`answer_${questionId}`, answer.data);
            }
        });

        try {
            await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/interview-answer/submit`,
                {
                    method: 'POST',
                    body: formData,
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

    if (sortedQuestions.length === 0 || !sortedQuestions[currentIndex]) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-700">Loading questions...</p>
                </div>
            </div>
        );
    }

    const currentQuestion = sortedQuestions[currentIndex];
    const progress = ((currentIndex + 1) / sortedQuestions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Question {currentIndex + 1} /{' '}
                            {sortedQuestions.length}
                        </h2>
                        <div
                            className={`text-2xl font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-gray-900'}`}
                        >
                            {formatTime(timeRemaining)} remaining
                        </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>Total: {formatTime(totalTime)}</span>
                        <span>
                            Used: {formatTime(totalTime - timeRemaining)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        {currentQuestion.questionText}
                    </h3>

                    {currentQuestion.questionType === 'VIDEO' && (
                        <div className="space-y-4">
                            <div className="bg-black rounded-lg overflow-hidden aspect-video">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="flex gap-4">
                                {!isRecording ? (
                                    <Button
                                        onClick={startRecording}
                                        className="flex-1"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <circle cx="10" cy="10" r="8" />
                                        </svg>
                                        Start Recording
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={stopRecording}
                                        className="flex-1 bg-red-600 hover:bg-red-700"
                                    >
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <rect
                                                x="6"
                                                y="6"
                                                width="8"
                                                height="8"
                                            />
                                        </svg>
                                        Stop Recording
                                    </Button>
                                )}
                            </div>

                            {answers.has(currentQuestion.id) && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-green-700 text-sm">
                                        ✓ Answer recorded
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {currentQuestion.questionType === 'TEXT' && (
                        <div className="space-y-4">
                            <Textarea
                                value={textAnswer}
                                onChange={(e) => setTextAnswer(e.target.value)}
                                rows={12}
                                placeholder="Enter your answer..."
                                className="w-full"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleNext} className="px-8">
                        {currentIndex < sortedQuestions.length - 1
                            ? 'Next Question'
                            : 'Complete Interview'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
