export function Logo({ className = "h-6" }: { className?: string }) {
  // Using the original logo URL from the asset metadata
  const logoUrl = "https://www.abtalks.in/_next/image?url=%2Fabtalks-logo.png&w=384&q=75&dpl=dpl_F7oyoCZJLPhHL94xP7ns5L8F3NNv";
  
  return (
    <img
      src={logoUrl}
      alt="ABTalks"
      className={`${className} w-auto select-none`}
      width={300}
      height={84}
      onError={(e) => {
        // Fallback to text if image fails to load
        e.currentTarget.style.display = 'none';
        const parent = e.currentTarget.parentElement;
        if (parent && !parent.querySelector('.logo-fallback')) {
          const text = document.createElement('span');
          text.className = 'logo-fallback font-bold text-xl tracking-tight';
          text.innerText = 'AB TALKS';
          parent.appendChild(text);
        }
      }}
    />
  );
}
