import React from 'react';

export const WesternLogo = ({ height = 28, isDark }) => (
  <svg height={height} viewBox="0 0 170 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M4 4H28C28 16 22 26 16 31C10 26 4 16 4 4Z" fill="#4F2683" />
      <path d="M6 6H26C26 15 21 24 16 28C11 24 6 15 6 6Z" fill="#5E3199" />
      <path
        d="M10 13C12.5 12 15 13 16 14C17 13 19.5 12 22 13V20C19.5 19 17 20 16 21C15 20 12.5 19 10 20V13Z"
        fill="#FFFFFF"
      />
      <line x1="16" y1="14" x2="16" y2="21" stroke="#4F2683" strokeWidth="1" />
    </g>
    <text
      x="36"
      y="22"
      fontFamily="Georgia, -apple-system, serif"
      fontSize="16"
      fontWeight="700"
      letterSpacing="-0.01em"
      fill={isDark ? '#F8FAFC' : '#1E293B'}
    >
      Western
    </text>
    <text
      x="108"
      y="22"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontSize="11"
      fontWeight="600"
      letterSpacing="0.04em"
      fill={isDark ? '#94A3B8' : '#64748B'}
    >
      UNIVERSITY
    </text>
  </svg>
);

export const UbcLogo = ({ height = 28, isDark }) => (
  <svg height={height} viewBox="0 0 150 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M4 4H28C28 16 22 26 16 31C10 26 4 16 4 4Z" fill="#002145" />
      <circle cx="16" cy="14" r="5" fill="#EAA11F" />
      <path d="M8 14H24M16 6V14M11 9L21 19M21 9L11 19" stroke="#EAA11F" strokeWidth="1.2" />
      <path d="M6 18C9 17 11 19 16 18C21 17 23 19 26 18" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
      <path d="M8 22C11 21 13 23 16 22C19 21 21 23 24 22" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
    </g>
    <text
      x="36"
      y="23"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif"
      fontSize="17"
      fontWeight="900"
      letterSpacing="0.05em"
      fill={isDark ? '#38BDF8' : '#002145'}
    >
      UBC
    </text>
  </svg>
);

export const WaterlooLogo = ({ height = 28, isDark }) => (
  <svg height={height} viewBox="0 0 160 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M4 4H28C28 16 22 26 16 31C10 26 4 16 4 4Z" fill="#1A1A1A" />
      <path d="M5 5H27V12L16 19L5 12V5Z" fill="#FFD54F" />
      <path d="M5 12L16 19L27 12V18L16 25L5 18V12Z" fill="#E2231A" />
    </g>
    <text
      x="36"
      y="23"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      fontSize="15"
      fontWeight="800"
      letterSpacing="0.03em"
      fill={isDark ? '#F8FAFC' : '#0F172A'}
    >
      WATERLOO
    </text>
  </svg>
);

export const MicrosoftLogo = ({ height = 28, isDark }) => (
  <svg height={height} viewBox="0 0 155 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="6" width="11" height="11" fill="#F25022" />
    <rect x="17" y="6" width="11" height="11" fill="#7FBA00" />
    <rect x="4" y="19" width="11" height="11" fill="#00A4EF" />
    <rect x="17" y="19" width="11" height="11" fill="#FFB900" />
    <text
      x="35"
      y="23"
      fontFamily="Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, sans-serif"
      fontSize="16"
      fontWeight="600"
      fill={isDark ? '#F8FAFC' : '#2D3748'}
    >
      Microsoft
    </text>
  </svg>
);

export const GMLogo = ({ height = 28, isDark }) => (
  <svg height={height} viewBox="0 0 155 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gmGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0072CE" />
        <stop offset="100%" stopColor="#00A3E0" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="28" height="28" rx="8" stroke="url(#gmGrad)" strokeWidth="2.5" fill="none" />
    <text
      x="8.5"
      y="23"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      fontSize="16"
      fontWeight="700"
      fill="#0072CE"
    >
      gm
    </text>
    <line x1="19" y1="26" x2="27" y2="26" stroke="#00A3E0" strokeWidth="2" strokeLinecap="round" />
    <text
      x="40"
      y="22"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      fontSize="14"
      fontWeight="700"
      fill={isDark ? '#F8FAFC' : '#1E293B'}
    >
      General Motors
    </text>
  </svg>
);

export const ScotiabankLogo = ({ height = 28, isDark }) => (
  <svg height={height} viewBox="0 0 155 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="17" cy="18" r="13" fill="#EC111A" />
    <path
      d="M12 23C13.5 24.5 17 24.5 19 23C21 21 19.5 19 17 18C14 17 13 15 15 13C16.8 11.2 20.5 11.2 22 13"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <text
      x="37"
      y="23"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      fontSize="15"
      fontWeight="700"
      fill={isDark ? '#F8FAFC' : '#1E293B'}
    >
      Scotiabank
    </text>
  </svg>
);

export const LoblawLogo = ({ height = 28, isDark }) => (
  <svg height={height} viewBox="0 0 135 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M5 6V26H17V21H10V6H5Z" fill="#E31837" />
      <path d="M14 10V30H26V25H19V10H14Z" fill="#F37021" />
    </g>
    <text
      x="34"
      y="23"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      fontSize="15"
      fontWeight="700"
      fill={isDark ? '#F8FAFC' : '#1E293B'}
    >
      Loblaw
    </text>
  </svg>
);

export const TrojAILogo = ({ height = 28, isDark }) => (
  <svg height={height} viewBox="0 0 135 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M5 8L16 4L27 8V18C27 24 16 29 16 29C16 29 5 24 5 18V8Z" fill="#EF4444" />
      <circle cx="16" cy="15" r="3.5" fill="#FFFFFF" />
      <line x1="16" y1="9" x2="16" y2="12" stroke="#FFFFFF" strokeWidth="1.5" />
      <line x1="16" y1="18" x2="16" y2="23" stroke="#FFFFFF" strokeWidth="1.5" />
    </g>
    <text
      x="35"
      y="23"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      fontSize="15"
      fontWeight="800"
      fill={isDark ? '#F8FAFC' : '#1E293B'}
    >
      TrojAI
    </text>
  </svg>
);

export const PalitronicaLogo = ({ height = 28, isDark }) => (
  <svg height={height} viewBox="0 0 155 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="paliGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#06B6D4" />
        <stop offset="100%" stopColor="#6366F1" />
      </linearGradient>
    </defs>
    <rect
      x="4"
      y="5"
      width="24"
      height="24"
      rx="6"
      fill={isDark ? 'rgba(6, 182, 212, 0.15)' : 'rgba(99, 102, 241, 0.1)'}
      stroke="url(#paliGrad)"
      strokeWidth="1.5"
    />
    <path
      d="M8 17H12L14 11L18 23L20 17H24"
      stroke="url(#paliGrad)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    <text
      x="36"
      y="22"
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
      fontSize="14"
      fontWeight="700"
      letterSpacing="-0.01em"
      fill={isDark ? '#F8FAFC' : '#1E293B'}
    >
      Palitronica
    </text>
  </svg>
);

/**
 * Universal PartnerLogo resolver
 */
export const PartnerLogo = ({ name = '', height = 28, isDark = true }) => {
  const clean = name.toLowerCase().trim();

  if (clean.includes('western')) {
    return <WesternLogo height={height} isDark={isDark} />;
  }
  if (clean.includes('british columbia') || clean.includes('ubc')) {
    return <UbcLogo height={height} isDark={isDark} />;
  }
  if (clean.includes('waterloo')) {
    return <WaterlooLogo height={height} isDark={isDark} />;
  }
  if (clean.includes('microsoft')) {
    return <MicrosoftLogo height={height} isDark={isDark} />;
  }
  if (clean.includes('general motors') || clean.includes('gm')) {
    return <GMLogo height={height} isDark={isDark} />;
  }
  if (clean.includes('scotia')) {
    return <ScotiabankLogo height={height} isDark={isDark} />;
  }
  if (clean.includes('loblaw')) {
    return <LoblawLogo height={height} isDark={isDark} />;
  }
  if (clean.includes('trojai') || clean.includes('troj')) {
    return <TrojAILogo height={height} isDark={isDark} />;
  }
  if (clean.includes('palitronica')) {
    return <PalitronicaLogo height={height} isDark={isDark} />;
  }

  // Fallback for any unexpected name
  return (
    <span
      style={{
        fontWeight: 700,
        fontSize: '0.9rem',
        color: isDark ? '#F8FAFC' : '#1E293B',
      }}
    >
      {name}
    </span>
  );
};

export default PartnerLogo;

