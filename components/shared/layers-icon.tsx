// components/shared/layers-icon.tsx
type LayersIconProps = { className?: string };

export default function LayersIcon({ className }: LayersIconProps) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className={className}
    >
      <path d="M20 4 36 14 20 24 4 14 20 4Z" fill="#4F5BF5" />
      <path d="M4 20 20 30 36 20" stroke="#8B93FA" strokeWidth="3" strokeLinejoin="round" />
      <path d="M4 26 20 36 36 26" stroke="#C3C7FC" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}