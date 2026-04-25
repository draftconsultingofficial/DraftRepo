"use client";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
    </div>
  );
}

export function SkeletonLine({ className = "" }: { className?: string } = {}) {
  return <div className={`h-4 bg-gray-200 rounded animate-pulse ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="panel rounded-lg p-6 space-y-4">
      <SkeletonLine />
      <div className="space-y-2">
        <SkeletonLine />
        <SkeletonLine />
      </div>
    </div>
  );
}

export function JobListingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="panel rounded-lg p-6 grid gap-4 lg:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <SkeletonLine />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3" />
            <div className="space-y-2">
              <SkeletonLine />
              <SkeletonLine className="w-5/6" />
            </div>
          </div>
          <div className="h-10 bg-gray-200 rounded animate-pulse w-32" />
        </div>
      ))}
    </div>
  );
}
