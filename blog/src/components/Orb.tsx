interface OrbProps {
  className?: string;
}

export function Orb({ className }: OrbProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${className || ''}`}
    >
      <div
        className="absolute inset-0 blur-3xl opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(240,240,240,0.9) 0%, rgba(230,230,230,0.7) 30%, rgba(219,234,254,0.25) 45%, rgba(251,146,180,0.2) 60%, rgba(251,113,133,0.15) 75%, rgba(251,191,36,0.1) 100%)',
          borderRadius: '8px'
        }}
      />

      <div
        className="relative w-full h-full"
        style={{
          borderRadius: '8px',
          background:
            'linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 30%, #dbeafe 45%, #fef3c7 60%, #fbcfe8 75%, #fb7185 85%, #fb923c 95%)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 6s ease infinite'
        }}
      >
        <div
          className="absolute inset-4 opacity-90"
          style={{
            borderRadius: '3px',
            background:
              'radial-gradient(circle at 30% 30%, rgba(248,250,252,1) 0%, rgba(241,245,249,0.6) 40%, transparent 70%)',
            filter: 'blur(10px)'
          }}
        />

        <div
          className="absolute inset-0 overflow-hidden opacity-60"
          style={{
            borderRadius: '8px',
            background:
              'linear-gradient(45deg, transparent 30%, rgba(248,250,252,1) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 3s linear infinite'
          }}
        />
      </div>
    </div>
  );
}
