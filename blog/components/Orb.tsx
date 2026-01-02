'use client';

interface ListeningOrbProps {
  className?: string;
}

export function ListeningOrb({ className }: ListeningOrbProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${className || ''}`}
    >
      <div
        className="absolute inset-0 blur-3xl opacity-30"
        style={{
          background:
            'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 30%, rgba(219,234,254,0.25) 45%, rgba(251,146,180,0.2) 60%, rgba(251,113,133,0.15) 75%, rgba(251,191,36,0.1) 100%)',
          borderRadius: '5px'
        }}
      />

      <div
        className="relative w-40 h-40"
        style={{
          borderRadius: '5px',
          background:
            'linear-gradient(135deg, #ffffff 0%, #ffffff 30%, #dbeafe 45%, #fef3c7 60%, #fbcfe8 75%, #fb7185 85%, #fb923c 95%)',
          backgroundSize: '200% 200%',
          animation: 'gradientShift 6s ease infinite'
        }}
      >
        <div
          className="absolute inset-4 opacity-90"
          style={{
            borderRadius: '3px',
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 40%, transparent 70%)',
            filter: 'blur(10px)'
          }}
        />

        <div
          className="absolute inset-0 overflow-hidden opacity-60"
          style={{
            borderRadius: '5px',
            background:
              'linear-gradient(45deg, transparent 30%, rgba(255,255,255,1) 50%, transparent 70%)',
            backgroundSize: '200% 200%',
            animation: 'gradientShift 3s linear infinite'
          }}
        />
      </div>
    </div>
  );
}
