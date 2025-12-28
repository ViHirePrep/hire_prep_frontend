import { Card } from '@/components/system';

interface QuestionCardProps {
    question: {
        id: string;
        title: string;
        difficulty: 'Easy' | 'Medium' | 'Hard';
        category: string;
    };
}

const difficultyColors = {
    Easy: 'text-green-600 bg-green-50',
    Medium: 'text-yellow-600 bg-yellow-50',
    Hard: 'text-red-600 bg-red-50',
};

export default function QuestionCard({ question }: QuestionCardProps) {
    return (
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-zinc-900">
                        {question.title}
                    </h3>
                    <span
                        className={`
              rounded-full px-2 py-1 text-xs font-medium
              ${difficultyColors[question.difficulty]}
            `}
                    >
                        {question.difficulty}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700">
                        {question.category}
                    </span>
                </div>
            </div>
        </Card>
    );
}
