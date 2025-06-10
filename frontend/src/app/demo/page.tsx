// src/app/demo/page.tsx
import DemoQuiz from '../../../components/DemoQuiz';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 text-white py-20 px-4">
      <DemoQuiz />
    </div>
  );
}
