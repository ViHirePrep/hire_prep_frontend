import { useState, useEffect, useRef } from 'react';

import Button from '@/components/system/Button';

interface DeviceTestProps {
    onComplete: () => void;
}

export default function DeviceTest({ onComplete }: DeviceTestProps) {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [testing, setTesting] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const requestPermissions = async () => {
        setTesting(true);
        setError(null);

        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            setStream(mediaStream);
            setPermissionGranted(true);

            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err: any) {
            setError(
                err?.message ||
                    'Cannot access camera/microphone. Please allow access permissions.',
            );
        } finally {
            setTesting(false);
        }
    };

    const handleContinue = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        onComplete();
    };

    useEffect(() => {
        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [stream]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Device Check
                </h1>
                <p className="text-gray-600 mb-8">
                    Before starting the interview, please check your camera and
                    microphone
                </p>

                <div className="mb-8">
                    <div className="bg-black rounded-lg overflow-hidden aspect-video mb-4">
                        {permissionGranted ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <svg
                                        className="w-24 h-24 mx-auto mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p>Camera is not enabled</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        {!permissionGranted && (
                            <Button
                                onClick={requestPermissions}
                                disabled={testing}
                                className="w-full"
                            >
                                {testing
                                    ? 'Testing...'
                                    : 'Test Camera & Microphone'}
                            </Button>
                        )}

                        {permissionGranted && (
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <p className="text-green-700 text-sm flex items-center">
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
                                        Device is working properly. You can now
                                        start the interview.
                                    </p>
                                </div>

                                <Button
                                    onClick={handleContinue}
                                    className="w-full"
                                >
                                    Start Interview
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    <p className="mb-2">Note:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>
                            Ensure you are in a quiet place with good lighting
                        </li>
                        <li>Check for stable internet connection</li>
                        <li>Do not reload the page during the interview</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
