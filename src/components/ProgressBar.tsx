export function ProgressBar({
  value,
  className = "",
  tone = "primary",
}: {
  value: number;
  className?: string;
  tone?: "primary" | "success";
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-[width] duration-700 ease-out ${
          tone === "success" ? "bg-success" : "bg-primary"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export function SegmentedProgress({ completed, total }: { completed: number; total: number }) {
  return (
    <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] gap-1" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-3 rounded-[3px] transition-colors duration-500 ${
            i < completed ? "bg-primary" : "bg-secondary"
          }`}
        />
      ))}
    </div>
  );
}
