/**
 * Design tokens extracted from the Figma design.
 * Dark theme music player palette.
 */
export const colors = {
  // Backgrounds
  background: '#0D0D0D',
  surface: '#1A1A1A',
  surfaceElevated: '#252525',
  surfaceLight: '#2A2A2A',

  // Primary accent
  primary: '#6C63FF',
  primaryLight: '#8B83FF',
  primaryDark: '#4F46E5',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textMuted: '#666666',
  textDisabled: '#444444',

  // Borders & Dividers
  border: '#2A2A2A',
  divider: '#1F1F1F',

  // Status
  error: '#FF4D4F',
  success: '#52C41A',

  // Seek bar
  seekBarTrack: '#333333',
  seekBarProgress: '#6C63FF',
  seekBarThumb: '#FFFFFF',

  // Overlay
  overlay: 'rgba(0, 0, 0, 0.6)',
  miniPlayerBg: '#1A1A1A',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 999,
};

export const typography = {
  // Large titles
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  // Small text
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  captionBold: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  // Tiny text
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  smallBold: {
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
  },
};

export const dimensions = {
  // Mini player
  miniPlayerHeight: 64,

  // Song card
  songCardHeight: 72,
  songCardArtSize: 48,

  // Player screen
  playerArtSize: 300,
  controlButtonLarge: 64,
  controlButtonMedium: 44,
  controlButtonSmall: 36,

  // Search bar
  searchBarHeight: 44,

  // Bottom safe area padding
  bottomSafeArea: 34,

  // Icon sizes
  iconSmall: 20,
  iconMedium: 24,
  iconLarge: 28,
  iconXLarge: 32,
};
