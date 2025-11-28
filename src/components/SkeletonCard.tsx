export function SkeletonCard() {
    return (
        <div className="glass-strong rounded-xl p-5 animate-fadeIn">
            <div className="flex items-center justify-between gap-4">
                {/* Left: Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded shimmer"></div>
                        <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full shimmer"></div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded shimmer"></div>
                        <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded shimmer"></div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <div className="h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-lg shimmer"></div>
                    <div className="h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-lg shimmer"></div>
                    <div className="h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-lg shimmer"></div>
                    <div className="h-9 w-9 bg-slate-200 dark:bg-slate-700 rounded-lg shimmer"></div>
                </div>
            </div>
        </div>
    );
}
