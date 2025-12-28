import { Card } from '@/components/system';

interface SessionCardProps {
    session: {
        id: string;
        date: string;
        questionsAnswered: number;
        score: number;
        duration: string;
    };
}

export default function SessionCard({ session }: SessionCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="space-y-4">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-semibold text-zinc-900">
                            {new Date(session.date).toLocaleDateString(
                                'en-US',
                                {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                },
                            )}
                        </p>
                        <p className="text-xs text-zinc-500">
                            {session.duration}
                        </p>
                    </div>
                    <div className="rounded-full bg-green-100 px-3 py-1">
                        <span className="text-sm font-semibold text-green-700">
                            {session.score}%
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                    <div>
                        <span className="text-zinc-500">Questions:</span>
                        <span className="ml-1 font-medium text-zinc-900">
                            {session.questionsAnswered}
                        </span>
                    </div>
                </div>
            </div>
        </Card>
    );
}
