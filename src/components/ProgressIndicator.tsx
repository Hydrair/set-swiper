"use client";

interface ProgressIndicatorProps {
  currentIndex: number;
  totalCount: number;
}

export default function ProgressIndicator({
  currentIndex,
  totalCount,
}: ProgressIndicatorProps) {
  const progressPercentage =
    totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0;

  return (
    <div className="mb-6 text-center pt-4">
      <div className="text-sm text-theme-secondary mb-2">
        Card {currentIndex + 1} of {totalCount}
      </div>
      <div className="w-full bg-theme-tertiary rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>
    </div>
  );
}
