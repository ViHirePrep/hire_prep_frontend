import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import Button from '@/components/system/Button';
import Input from '@/components/system/Input';
import Textarea from '@/components/system/Textarea';
import Select from '@/components/system/Select';
import Card from '@/components/system/Card';
import { useToast } from '@/lib/hooks/useToast';
import { getCurrentUser } from '@/lib/api';

interface AIProvider {
    alias: string;
    displayName: string;
    baseProvider: string;
    priority: number;
}

export default function CreateInterviewPage() {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [loadingProviders, setLoadingProviders] = useState(true);
    const [aiProviders, setAIProviders] = useState<AIProvider[]>([]);
    const [formData, setFormData] = useState({
        position: '',
        industry: 'IT',
        level: 'MIDDLE',
        stack: '',
        jobDescription: '',
        numQuestions: 5,
        timeLimit: 15,
        language: 'VIETNAMESE',
        aiProvider: '',
    });

    useEffect(() => {
        // Check if user is authenticated
        const user = getCurrentUser();

        if (!user) {
            router.push('/login');

            return;
        }

        fetchAIProviders();
    }, []);

    const fetchAIProviders = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/ai-providers`,
            );
            const providers = await response.json();

            setAIProviders(providers);
            if (providers.length > 0) {
                setFormData((prev) => ({
                    ...prev,
                    aiProvider: providers[0].alias,
                }));
            }
        } catch {
            toast.error(
                'Failed to load AI providers. Please refresh the page.',
            );
        } finally {
            setLoadingProviders(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/interview-sessions`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                    credentials: 'include',
                },
            );

            if (!response.ok) {
                const error = await response.json();

                throw new Error(error.message || 'Failed to create interview');
            }

            const { id } = await response.json();

            router.push(`/interview/session/${id}`);
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err?.message
                    : 'Unable to create interview session. Please try again.',
            );
        } finally {
            setLoading(false);
        }
    };

    if (loadingProviders) {
        return (
            <div className="min-h-screen bg-linear-to-br from-primary/5 via-white to-accent/5 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-primary/5 via-white to-accent/5 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
                        Create AI Mock Interview
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Set up your AI-powered interview session with
                        customizable parameters and get instant feedback
                    </p>
                </div>

                <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Job Description
                                    <span className="text-xs text-gray-500 font-normal ml-2">
                                        (optional)
                                    </span>
                                </label>
                                <Textarea
                                    value={formData.jobDescription}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            jobDescription: e.target.value,
                                        })
                                    }
                                    rows={6}
                                    placeholder="Paste the job description, key requirements, and responsibilities... (optional, we'll generate generic questions if not provided)"
                                    className="text-base"
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="pb-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    Position Details
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Tell us about the role you're hiring for
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Position / Role
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <Input
                                    value={formData.position}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            position: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., Senior Frontend Developer"
                                    required
                                    className="text-base"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Industry
                                    </label>
                                    <Select
                                        value={formData.industry}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                industry: e.target.value,
                                            })
                                        }
                                        className="text-base"
                                    >
                                        <option value="IT">
                                            Information Technology
                                        </option>
                                        {/* <option value="MARKETING">
                                            Marketing
                                        </option>
                                        <option value="FINANCE">Finance</option>
                                        <option value="HR">
                                            Human Resources
                                        </option>
                                        <option value="SALES">Sales</option>
                                        <option value="OTHER">Other</option> */}
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Experience Level
                                    </label>
                                    <Select
                                        value={formData.level}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                level: e.target.value,
                                            })
                                        }
                                        className="text-base"
                                    >
                                        <option value="INTERN">Intern</option>
                                        <option value="FRESHER">Fresher</option>
                                        <option value="JUNIOR">Junior</option>
                                        <option value="MIDDLE">Middle</option>
                                        <option value="SENIOR">Senior</option>
                                        <option value="EXPERT">
                                            Expert / Lead
                                        </option>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Stack
                                    <span className="text-xs text-gray-500 font-normal ml-2">
                                        (for IT roles)
                                    </span>
                                </label>
                                <Select
                                    value={formData.stack}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            stack: e.target.value,
                                        })
                                    }
                                    className="text-base"
                                >
                                    <option value="">Select stack</option>
                                    <option value="BACKEND">Backend</option>
                                    <option value="FRONTEND">Frontend</option>
                                    <option value="FULLSTACK">
                                        Full Stack
                                    </option>
                                    <option value="DEVOPS">DevOps</option>
                                    <option value="MOBILE">Mobile</option>
                                    <option value="DATA">Data</option>
                                    <option value="QA">QA / Testing</option>
                                    <option value="SECURITY">Security</option>
                                    <option value="CLOUD">Cloud</option>
                                    <option value="AI_ML">AI / ML</option>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="pb-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                                    Interview Configuration
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Customize your interview parameters
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Number of Questions
                                    </label>
                                    <Select
                                        value={formData.numQuestions.toString()}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                numQuestions: parseInt(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                        className="text-base"
                                    >
                                        <option value="5">5 questions</option>
                                        <option value="10">10 questions</option>
                                        <option value="15">15 questions</option>
                                        <option value="20">20 questions</option>
                                        <option value="25">25 questions</option>
                                        <option value="30">30 questions</option>
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Time Limit
                                    </label>
                                    <Select
                                        value={formData.timeLimit.toString()}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                timeLimit: parseInt(
                                                    e.target.value,
                                                ),
                                            })
                                        }
                                        className="text-base"
                                    >
                                        <option value="10">10 minutes</option>
                                        <option value="15">15 minutes</option>
                                        <option value="30">30 minutes</option>
                                        <option value="45">45 minutes</option>
                                        <option value="60">60 minutes</option>
                                        <option value="90">90 minutes</option>
                                        <option value="120">120 minutes</option>
                                        <option value="180">180 minutes</option>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        AI Model
                                    </label>
                                    <Select
                                        value={formData.aiProvider}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                aiProvider: e.target.value,
                                            })
                                        }
                                        className="text-base"
                                    >
                                        {aiProviders.map((provider) => (
                                            <option
                                                key={provider.alias}
                                                value={provider.alias}
                                            >
                                                {provider.displayName}
                                            </option>
                                        ))}
                                    </Select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Interview Language
                                    </label>
                                    <Select
                                        value={formData.language}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                language: e.target.value,
                                            })
                                        }
                                        className="text-base"
                                    >
                                        <option value="VIETNAMESE">
                                            Vietnamese
                                        </option>
                                        <option value="ENGLISH">English</option>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 text-lg font-semibold bg-linear-to-r from-primary to-accent hover:shadow-lg transition-all"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Creating interview...
                                    </span>
                                ) : (
                                    'Create Interview Session'
                                )}
                            </Button>
                        </div>
                    </form>
                </Card>

                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <Card className="p-6 bg-white/60 backdrop-blur-sm border-primary/20">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <svg
                                className="w-6 h-6 text-primary"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                            AI-Generated Questions
                        </h3>
                        <p className="text-sm text-gray-600">
                            Questions tailored to the job description and
                            requirements
                        </p>
                    </Card>

                    <Card className="p-6 bg-white/60 backdrop-blur-sm border-accent/20">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                            <svg
                                className="w-6 h-6 text-accent"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                            Instant Evaluation
                        </h3>
                        <p className="text-sm text-gray-600">
                            Get AI-powered scoring and detailed feedback
                            immediately
                        </p>
                    </Card>

                    <Card className="p-6 bg-white/60 backdrop-blur-sm border-primary/20">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <svg
                                className="w-6 h-6 text-primary"
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
                        <h3 className="font-semibold text-gray-900 mb-2">
                            Multi-Format Answers
                        </h3>
                        <p className="text-sm text-gray-600">
                            Support for video, audio, text, and code responses
                        </p>
                    </Card>
                </div>
            </div>
            <toast.ToastContainer />
        </div>
    );
}
