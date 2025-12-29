import { useRef, useState, useEffect } from 'react';

import Button from '@/components/system/Button';
import { useToast } from '@/lib/hooks/useToast';

interface VideoAnswerProps {
    questionId: string;
    onAnswer?: (answer: {
        type: 'video';
        data: Blob;
        questionId: string;
    }) => void;
    autoRecord?: boolean;
}

export default function VideoAnswer({
    questionId,
    onAnswer,
    autoRecord = false,
    enablePreview = false,
    hideControls = false,
}: VideoAnswerProps & { enablePreview?: boolean; hideControls?: boolean }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const { error: showError } = useToast();

    const initializeRecording = async () => {
        try {
            if (streamRef.current) return; // Don't re-init if already exists
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

    const startRecording = async () => {
        if (!streamRef.current) {
            await initializeRecording();
            if (!streamRef.current) return;
        }
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

            if (onAnswer) {
                onAnswer({ type: 'video', data: blob, questionId });
            }
        }
    };

    useEffect(() => {
        if (autoRecord && !isRecording) {
            (async () => {
                await initializeRecording();
                await startRecording();
            })();
        }
    }, [autoRecord]);

    useEffect(() => {
        if (enablePreview) {
            initializeRecording();
        }
    }, [enablePreview]);

    useEffect(() => {
        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    });

    return (
        <div className="space-y-4 w-full flex flex-col items-center justify-center">
            <div className="bg-black rounded-lg overflow-hidden aspect-video shadow-lg ring-2 ring-primary/30 w-full relative">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />
                {isRecording && (
                    <div className="absolute top-4 right-4 animate-pulse">
                        <div className="bg-red-600 rounded-full w-3 h-3 shadow-sm shadow-red-900/50"></div>
                    </div>
                )}
            </div>
            {!autoRecord && !hideControls && (
                <div className="flex gap-4 w-full">
                    {!isRecording ? (
                        <Button
                            onClick={startRecording}
                            className="flex-1 bg-linear-to-r from-primary to-accent text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <circle cx="10" cy="10" r="8" />
                            </svg>
                            Bắt đầu ghi hình
                        </Button>
                    ) : (
                        <Button
                            onClick={stopRecording}
                            className="flex-1 bg-linear-to-r from-red-500 to-red-700 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <rect x="6" y="6" width="8" height="8" />
                            </svg>
                            Dừng ghi hình
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
