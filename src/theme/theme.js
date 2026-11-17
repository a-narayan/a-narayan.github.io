import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode = 'dark') => {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#3B82F6' : '#1D4ED8',
        light: isDark ? '#60A5FA' : '#3B82F6',
        dark: isDark ? '#1D4ED8' : '#1E40AF',
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: isDark ? '#06B6D4' : '#0284C7',
        light: isDark ? '#22D3EE' : '#38BDF8',
        dark: isDark ? '#0891B2' : '#0369A1',
        contrastText: '#FFFFFF',
      },
      background: {
        default: isDark ? '#080B11' : '#F8FAFC',
        paper: isDark ? '#0F1523' : '#FFFFFF',
        card: isDark ? 'rgba(15, 21, 35, 0.85)' : '#FFFFFF',
        subtle: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F1F5F9',
      },
      text: {
        primary: isDark ? '#F8FAFC' : '#0F172A',
        secondary: isDark ? '#CBD5E1' : '#475569',
        muted: isDark ? '#94A3B8' : '#64748B',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
        selected: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(29, 78, 216, 0.1)',
      },
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      h1: {
        fontFamily: "'Plus Jakarta Sans', 'Space Grotesk', sans-serif",
        fontWeight: 800,
        letterSpacing: '-0.03em',
        lineHeight: 1.15,
      },
      h2: {
        fontFamily: "'Plus Jakarta Sans', 'Space Grotesk', sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.025em',
        lineHeight: 1.2,
      },
      h3: {
        fontFamily: "'Plus Jakarta Sans', 'Space Grotesk', sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.25,
      },
      h4: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 700,
        letterSpacing: '-0.02em',
        lineHeight: 1.3,
      },
      h5: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
        letterSpacing: '-0.015em',
        lineHeight: 1.35,
      },
      h6: {
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        fontWeight: 600,
        letterSpacing: '-0.01em',
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.7,
        letterSpacing: '-0.005em',
      },
      body2: {
        fontSize: '0.9rem',
        lineHeight: 1.65,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: [
      'none',
      isDark ? '0 1px 3px 0 rgba(0, 0, 0, 0.5)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.5)' : '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
      isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.6)' : '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
      isDark ? '0 20px 25px -5px rgba(0, 0, 0, 0.7)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      ...Array(20).fill('none'),
    ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '9999px',
            padding: '8px 20px',
            fontSize: '0.925rem',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          },
          containedPrimary: {
            background: isDark
              ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
              : 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
            boxShadow: isDark
              ? '0 4px 14px 0 rgba(59, 130, 246, 0.35)'
              : '0 4px 14px 0 rgba(29, 78, 216, 0.25)',
            '&:hover': {
              background: isDark
                ? 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)'
                : 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
              transform: 'translateY(-1px)',
              boxShadow: isDark
                ? '0 6px 20px 0 rgba(59, 130, 246, 0.5)'
                : '0 6px 20px 0 rgba(29, 78, 216, 0.35)',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    custom: {
      isDark,
      navBg: isDark ? 'rgba(8, 11, 17, 0.85)' : 'rgba(255, 255, 255, 0.85)',
      navBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
      cardBg: isDark ? 'rgba(15, 21, 35, 0.75)' : '#FFFFFF',
      cardBorder: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
      cardHoverBorder: isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(29, 78, 216, 0.3)',
      heroGradient: isDark
        ? 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.25), transparent)'
        : 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.12), transparent)',
      glowGradient: isDark
        ? 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 50%, #06B6D4 100%)'
        : 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 50%, #0284C7 100%)',
      pillBg: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(29, 78, 216, 0.08)',
      pillBorder: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(29, 78, 216, 0.2)',
      pillText: isDark ? '#60A5FA' : '#1D4ED8',
      footerBg: isDark ? '#05070B' : '#F1F5F9',
    },
  });
};

