import logo from "@/assets/abtalks-logo.webp.asset.json";

export function Logo({ className = "h-6" }: { className?: string }) {
  return (
    <img
      src={logo.url}
      alt="ABTalks"
      className={`${className} w-auto select-none`}
      width={300}
      height={84}
    />
  );
}
