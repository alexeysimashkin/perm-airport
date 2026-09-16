'use client';
import { useEffect, useState } from 'react';

export default function SplashLoader({ onComplete }: { onComplete: () => void }) {
  const letters = "КОНДРАТОВО".split("");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, backgroundColor: '#020617',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: 9999
    }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fillBar {
          from { width: 0; }
          to { width: 200px; }
        }
        .splash-letter {
          display: inline-block;
          font-family: monospace;
          font-size: 56px;
          font-weight: 900;
          color: #ffffff;
          margin: 0 6px;
          opacity: 0;
          animation: fadeInUp 0.5s forwards;
        }
      `}</style>
      <div>
        {letters.map((char, i) => (
          <span 
            key={i} 
            className="splash-letter"
            style={{ animationDelay: `${i * 0.15}s` }}
          >
            {char}
          </span>
        ))}
      </div>
      <div style={{
        height: '3px', backgroundColor: '#10b981', marginTop: '24px',
        borderRadius: '4px', animation: 'fillBar 2s ease-in-out forwards'
      }} />
    </div>
  );
}
