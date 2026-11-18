import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dimensions = {
    sm: { width: 34, height: 34, text: 'text-xl', gap: 'gap-2.5' },
    md: { width: 44, height: 44, text: 'text-2xl', gap: 'gap-3' },
    lg: { width: 58, height: 58, text: 'text-3xl', gap: 'gap-3.5' }
  }[size];

  return (
    <Link href="/" className={`flex items-center ${dimensions.gap} font-black tracking-tight hover:opacity-90 transition-all group`}>
      <div className="relative flex items-center justify-center p-1 rounded-2xl bg-gradient-to-br from-[#8b5cf6]/20 via-[#7c3aed]/10 to-transparent border border-[#a855f7]/30 shadow-[0_0_20px_rgba(139,92,246,0.25)] group-hover:border-[#a855f7]/70 group-hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all">
        <Image
          src="/logo.png"
          alt="PR Agent"
          width={dimensions.width}
          height={dimensions.height}
          className="object-contain filter drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]"
          priority
        />
      </div>
      <span className={`bg-gradient-to-r from-white via-purple-100 to-[#c084fc] bg-clip-text text-transparent font-black ${dimensions.text} tracking-wider`}>
        PR Agent
      </span>
    </Link>
  );
}
