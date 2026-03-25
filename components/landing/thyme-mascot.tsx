"use client";

import { useEffect, useState } from "react";

export function ThymeMascot({ className = "" }: { className?: string }) {
  const [blink, setBlink] = useState(false);
  const [bounce, setBounce] = useState(0);

  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounce((b) => b + 1);
    }, 2000);
    return () => clearInterval(bounceInterval);
  }, []);

  return (
    <svg
      viewBox="0 0 300 400"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B9B37" />
          <stop offset="100%" stopColor="#4A7A2E" />
        </linearGradient>
        <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8BC34A" />
          <stop offset="100%" stopColor="#558B2F" />
        </linearGradient>
        <linearGradient id="leafGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#9CCC65" />
          <stop offset="100%" stopColor="#689F38" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.15" />
        </filter>
      </defs>

      <g filter="url(#shadow)">
        <g
          style={{
            transform: `translateY(${Math.sin(bounce) * 3}px)`,
            transition: "transform 0.6s ease-in-out",
          }}
        >
          <rect x="140" y="220" width="20" height="100" rx="10" fill="#5D8A30" />

          <g>
            <ellipse
              cx="110" cy="240" rx="40" ry="16"
              fill="url(#leafGrad)"
              transform="rotate(-30, 110, 240)"
              style={{ transformOrigin: "140px 240px", animation: "leafSway1 3s ease-in-out infinite" }}
            />
            <ellipse
              cx="105" cy="275" rx="35" ry="14"
              fill="url(#leafGrad2)"
              transform="rotate(-20, 105, 275)"
              style={{ transformOrigin: "140px 275px", animation: "leafSway2 3.5s ease-in-out infinite" }}
            />
          </g>

          <g>
            <ellipse
              cx="190" cy="255" rx="40" ry="16"
              fill="url(#leafGrad)"
              transform="rotate(25, 190, 255)"
              style={{ transformOrigin: "160px 255px", animation: "leafSway2 3.2s ease-in-out infinite" }}
            />
            <ellipse
              cx="195" cy="290" rx="32" ry="13"
              fill="url(#leafGrad2)"
              transform="rotate(15, 195, 290)"
              style={{ transformOrigin: "160px 290px", animation: "leafSway1 2.8s ease-in-out infinite" }}
            />
          </g>

          <circle cx="150" cy="160" r="80" fill="url(#bodyGrad)" />
          <circle cx="105" cy="180" r="15" fill="#8BC34A" opacity="0.5" />
          <circle cx="195" cy="180" r="15" fill="#8BC34A" opacity="0.5" />

          {blink ? (
            <>
              <line x1="118" y1="150" x2="138" y2="150" stroke="#2E5A1C" strokeWidth="3" strokeLinecap="round" />
              <line x1="162" y1="150" x2="182" y2="150" stroke="#2E5A1C" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : (
            <>
              <ellipse cx="128" cy="148" rx="12" ry="14" fill="white" />
              <ellipse cx="172" cy="148" rx="12" ry="14" fill="white" />
              <circle cx="130" cy="146" r="7" fill="#2E5A1C" />
              <circle cx="174" cy="146" r="7" fill="#2E5A1C" />
              <circle cx="132" cy="143" r="2.5" fill="white" />
              <circle cx="176" cy="143" r="2.5" fill="white" />
            </>
          )}

          <path d="M 135 175 Q 150 192 165 175" fill="none" stroke="#2E5A1C" strokeWidth="3" strokeLinecap="round" />

          <g style={{ transformOrigin: "150px 85px", animation: "topLeafWave 2.5s ease-in-out infinite" }}>
            <path d="M 150 85 Q 140 50 115 35 Q 145 45 150 85" fill="#8BC34A" />
            <path d="M 150 85 Q 160 45 185 30 Q 155 42 150 85" fill="#9CCC65" />
            <path d="M 150 85 Q 150 55 150 25 Q 152 55 150 85" fill="#7CB342" />
          </g>

          <g style={{ animation: "armWave 2s ease-in-out infinite", transformOrigin: "80px 190px" }}>
            <path d="M 80 185 Q 55 170 45 180 Q 50 185 60 182" fill="url(#bodyGrad)" stroke="#4A7A2E" strokeWidth="1" />
          </g>
          <g style={{ animation: "armWave2 2.2s ease-in-out infinite", transformOrigin: "220px 190px" }}>
            <path d="M 220 185 Q 245 170 255 180 Q 250 185 240 182" fill="url(#bodyGrad)" stroke="#4A7A2E" strokeWidth="1" />
          </g>

          <ellipse cx="135" cy="325" rx="18" ry="10" fill="#4A7A2E" />
          <ellipse cx="165" cy="325" rx="18" ry="10" fill="#4A7A2E" />
        </g>
      </g>

      <style>{`
        @keyframes leafSway1 {
          0%, 100% { transform: rotate(-30deg); }
          50% { transform: rotate(-25deg); }
        }
        @keyframes leafSway2 {
          0%, 100% { transform: rotate(25deg); }
          50% { transform: rotate(20deg); }
        }
        @keyframes topLeafWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(5deg); }
          75% { transform: rotate(-5deg); }
        }
        @keyframes armWave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-12deg); }
        }
        @keyframes armWave2 {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(12deg); }
        }
      `}</style>
    </svg>
  );
}
