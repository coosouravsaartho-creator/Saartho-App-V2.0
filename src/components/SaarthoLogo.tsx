import React from 'react';

interface SaarthoLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function SaarthoLogo({ className = '', size = 'full' }: SaarthoLogoProps) {
  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Outer Card Container mirroring the exact artwork */}
      <div className="w-full max-w-[440px] rounded-3xl p-6 sm:p-7 relative overflow-hidden bg-gradient-to-br from-white/95 via-sky-50/90 to-blue-50/95 border border-white/80 shadow-2xl shadow-blue-900/15 backdrop-blur-xl">
        {/* Radiant Ambient Background Swirls */}
        <div className="absolute -top-16 -left-16 w-52 h-52 bg-gradient-to-br from-amber-400/25 via-rose-500/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-gradient-to-tl from-cyan-400/25 via-blue-600/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-1/2 -left-12 w-40 h-40 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />
        
        {/* Subtle Background Cityscape & Tech Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.07] pointer-events-none" />

        {/* 1. Main 3D Emblem 'S' SVG */}
        <div className="relative flex justify-center mb-3">
          <svg viewBox="0 0 320 230" className="w-56 sm:w-64 h-auto drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              {/* Linear and Radial Gradients matching the artwork */}
              <linearGradient id="sTopGrad" x1="0%" y1="0%" x2="100%" y2="80%">
                <stop offset="0%" stopColor="#ff4d00" />
                <stop offset="35%" stopColor="#f43f5e" />
                <stop offset="65%" stopColor="#d946ef" />
                <stop offset="85%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>

              <linearGradient id="sBottomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="50%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>

              <linearGradient id="speedOrange" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff4d00" />
                <stop offset="100%" stopColor="#fb923c" />
              </linearGradient>
              <linearGradient id="speedPink" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f43f5e" />
                <stop offset="100%" stopColor="#fb7185" />
              </linearGradient>
              <linearGradient id="speedPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#c026d3" />
                <stop offset="100%" stopColor="#e879f9" />
              </linearGradient>
              <linearGradient id="speedBlue" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              <linearGradient id="greenArrow" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>

              {/* Drop Shadow filter for 3D depth */}
              <filter id="shadow3D" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.22" />
              </filter>
              <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#22c55e" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* Speed Streak Horizontal Lines on Left */}
            <g opacity="0.95">
              <rect x="52" y="58" width="40" height="4.5" rx="2.25" fill="url(#speedOrange)" />
              <circle cx="44" cy="60.25" r="2.25" fill="#fb923c" />

              <rect x="62" y="74" width="34" height="4.5" rx="2.25" fill="url(#speedPink)" />
              <circle cx="53" cy="76.25" r="2.25" fill="#f43f5e" />

              <rect x="72" y="90" width="32" height="4.5" rx="2.25" fill="url(#speedPurple)" />
              <circle cx="64" cy="92.25" r="2.25" fill="#c026d3" />

              <rect x="76" y="106" width="36" height="4.5" rx="2.25" fill="url(#speedBlue)" />
              <circle cx="68" cy="108.25" r="2.25" fill="#0284c7" />
            </g>

            {/* Growth Bar Chart inside Top Loop */}
            <g opacity="0.95">
              <rect x="180" y="58" width="8.5" height="15" rx="2" fill="#16a34a" />
              <rect x="193" y="47" width="8.5" height="26" rx="2" fill="#22c55e" />
              <rect x="206" y="34" width="8.5" height="39" rx="2" fill="#4ade80" />
            </g>

            {/* Upward Green Growth Arrow swooping out of Top Loop */}
            <path
              d="M165 52 C185 40, 205 28, 222 18 L220 30 L234 16 L216 10 L220 19 C200 30, 180 44, 162 55 Z"
              fill="url(#greenArrow)"
              filter="url(#glowGreen)"
            />

            {/* Top Loop of the 'S' Ribbon */}
            <path
              d="M178 18 C135 18, 98 44, 102 78 C106 108, 142 118, 178 126 C210 133, 238 145, 234 172 C230 200, 188 214, 145 204 C120 198, 100 183, 90 166 L74 180 C88 205, 116 224, 150 228 C206 234, 256 210, 260 166 C264 122, 218 108, 182 100 C150 93, 126 84, 128 66 C130 52, 150 40, 176 40 C198 40, 216 48, 226 62 L244 50 C230 30, 206 18, 178 18 Z"
              fill="url(#sTopGrad)"
              filter="url(#shadow3D)"
            />

            {/* Bottom Swooping Wing / Blue Base Loop */}
            <path
              d="M86 105 L138 105 C138 105, 110 145, 146 172 C178 196, 222 188, 236 156 C240 146, 238 136, 232 128 C238 140, 236 152, 228 162 C214 180, 176 186, 148 162 C124 142, 140 115, 154 105 L86 105 Z"
              fill="url(#sBottomGrad)"
              opacity="0.9"
            />

            {/* Handshake Icon inside the bottom circle */}
            <g transform="translate(142, 118) scale(0.95)" filter="url(#shadow3D)">
              {/* Left hand sleeve & cuff */}
              <path d="M-12 18 L-2 4 L14 16 L4 30 Z" fill="#0284c7" />
              {/* Right hand sleeve & cuff */}
              <path d="M46 18 L36 4 L20 16 L30 30 Z" fill="#1d4ed8" />
              {/* Shaking Hands clasp */}
              <path
                d="M4 14 C8 10, 16 10, 22 14 L28 20 C32 24, 30 30, 24 32 L16 34 C12 34, 8 32, 6 28 L0 20 Z"
                fill="#ffffff"
              />
              <path
                d="M10 16 L20 24 M13 20 L22 27 M16 23 L24 30"
                stroke="#1d4ed8"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>

        {/* 2. Brand Name Typography: Saartho with Rainbow Gradient Letters */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center text-4xl sm:text-5xl font-black tracking-tight leading-none">
            <span className="text-[#0f2347]">S</span>
            <span className="text-[#f9572b]">a</span>
            <span className="text-[#e11d48]">a</span>
            <span className="text-[#9333ea]">r</span>
            <span className="text-[#2563eb]">t</span>
            <span className="text-[#06b6d4]">h</span>
            <span className="text-[#10b981]">o</span>
          </div>

          {/* Slogan Line with Colored Accent Wings */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-6 h-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-normal">
              Har Business ka Bharosa
            </h3>
            <span className="w-6 h-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500" />
          </div>

          {/* Legal Company Subtitle */}
          <p className="text-[11px] font-medium text-slate-500 mt-1 flex items-center justify-center gap-1.5">
            <span className="text-slate-400">•</span>
            <span>Saartho Technologies Pvt. Ltd.</span>
            <span className="text-slate-400">•</span>
          </p>
        </div>

        {/* 3. 4 Feature Icons Row (Billing, Accounting, Business Growth, Trust & Security) */}
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mt-5 pt-4 border-t border-slate-200/80">
          {/* Feature 1: Billing */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-blue-100 shadow-sm flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                {/* Document */}
                <path d="M4 4C4 2.89543 4.89543 2 6 2H14L19 7V20C19 21.1046 18.1046 22 17 22H6C4.89543 22 4 21.1046 4 20V4Z" stroke="#2563eb" strokeWidth="2" fill="#eff6ff" />
                <path d="M14 2V7H19" stroke="#2563eb" strokeWidth="2" />
                {/* Rupee Circle Badge */}
                <circle cx="16" cy="16" r="5" fill="#1d4ed8" />
                <text x="16" y="19" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#ffffff">₹</text>
                {/* Speed lines */}
                <line x1="1" y1="8" x2="3" y2="8" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="0" y1="12" x2="3" y2="12" stroke="#f97316" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">
              Billing
            </span>
          </div>

          {/* Feature 2: Accounting */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-blue-100 shadow-sm flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <rect x="4" y="2" width="16" height="20" rx="3" stroke="#2563eb" strokeWidth="2" fill="#eff6ff" />
                <rect x="7" y="5" width="10" height="3" rx="1" fill="#1e40af" />
                <rect x="7" y="10" width="2" height="2" rx="0.5" fill="#2563eb" />
                <rect x="11" y="10" width="2" height="2" rx="0.5" fill="#2563eb" />
                <rect x="15" y="10" width="2" height="2" rx="0.5" fill="#2563eb" />
                <rect x="7" y="14" width="2" height="2" rx="0.5" fill="#2563eb" />
                <rect x="11" y="14" width="2" height="2" rx="0.5" fill="#2563eb" />
                <rect x="15" y="14" width="2" height="2" rx="0.5" fill="#2563eb" />
                <rect x="7" y="18" width="2" height="2" rx="0.5" fill="#2563eb" />
                <rect x="11" y="18" width="6" height="2" rx="0.5" fill="#16a34a" />
              </svg>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">
              Accounting
            </span>
          </div>

          {/* Feature 3: Business Growth */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-blue-100 shadow-sm flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <rect x="3" y="16" width="3.5" height="6" rx="1" fill="#2563eb" />
                <rect x="8" y="12" width="3.5" height="10" rx="1" fill="#8b5cf6" />
                <rect x="13" y="8" width="3.5" height="14" rx="1" fill="#f43f5e" />
                <rect x="18" y="4" width="3.5" height="18" rx="1" fill="#16a34a" />
                <path d="M3 13 C8 9, 14 5, 21 2 L21 6 L21 2 L17 2" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">
              Business Growth
            </span>
          </div>

          {/* Feature 4: Trust & Security */}
          <div className="flex flex-col items-center text-center group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-blue-100 shadow-sm flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M12 2L4 5V11.5C4 16.5 7.5 20.5 12 22C16.5 20.5 20 16.5 20 11.5V5L12 2Z" fill="#1e40af" stroke="#2563eb" strokeWidth="1.5" />
                <path d="M8.5 11.5L11 14L15.5 9" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 mt-1.5 leading-tight">
              Trust &amp; Security
            </span>
          </div>
        </div>

        {/* 4. Bottom Highlights Pill Container */}
        <div className="mt-4 p-2 sm:p-2.5 rounded-2xl bg-white/90 border border-slate-200/80 shadow-md flex items-center justify-between divide-x divide-slate-100 text-[10px] sm:text-[11px]">
          {/* Speed */}
          <div className="flex items-center gap-1.5 px-2 flex-1 justify-center">
            <span className="text-base sm:text-lg">🚀</span>
            <div className="text-left">
              <span className="font-extrabold text-slate-900 uppercase tracking-wider block text-[9px] sm:text-[10px] leading-tight">
                SPEED
              </span>
              <span className="text-slate-500 text-[9px] block leading-tight">Fast &amp; Efficient</span>
            </div>
          </div>

          {/* Growth */}
          <div className="flex items-center gap-1.5 px-2 flex-1 justify-center">
            <span className="text-base sm:text-lg">📈</span>
            <div className="text-left">
              <span className="font-extrabold text-slate-900 uppercase tracking-wider block text-[9px] sm:text-[10px] leading-tight">
                GROWTH
              </span>
              <span className="text-slate-500 text-[9px] block leading-tight">Built for Growth</span>
            </div>
          </div>

          {/* Trust */}
          <div className="flex items-center gap-1.5 px-2 flex-1 justify-center">
            <span className="text-base sm:text-lg">🤝</span>
            <div className="text-left">
              <span className="font-extrabold text-slate-900 uppercase tracking-wider block text-[9px] sm:text-[10px] leading-tight">
                TRUST
              </span>
              <span className="text-slate-500 text-[9px] block leading-tight">Always Reliable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
