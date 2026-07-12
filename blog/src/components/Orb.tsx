interface OrbProps {
  className?: string;
}

export function Orb({ className }: OrbProps) {
  return (
    <div
      className={`relative flex items-center justify-center rounded-lg bg-[#152231] ${className || ''}`}
    >
    </div>
  );
}
