// ---- Design tokens ----
// Palette: deep clinical ink-navy as primary (reads as premium/trustworthy,
// distinct from generic bright SaaS blue), a muted teal accent used sparingly,
// and a cool paper background instead of stark white or cream.
const primary = "#123C5C";
const primaryDark = "#0B2A40";
const primaryTint = "#E4EDF3"; // soft tint — avatars, pills, highlighted backgrounds
const accent = "#0E7C86"; // reserved for focus states / secondary emphasis
const background = "#F5F7F9";
const surface = "#FFFFFF";
const border = "#DCE3EA";
const textPrimary = "#1B2733";
const textSecondary = "#5B6B7A";
const textMuted = "#93A0AC";
const success = "#1E8F5F";
const warning = "#C67C1D";
const danger = "#C23B3B";
const info = "#2C6E9E";

export const COLORS = {
  // Legacy keys — kept so screens not yet redesigned (Login, Add, Edit,
  // Details) keep working unchanged until their turn.
  white: surface,
  blue: primary,
  lightGray: background,
  text: textPrimary,
  danger,

  // Extended design system
  primary,
  primaryDark,
  primaryTint,
  accent,
  background,
  surface,
  border,
  textPrimary,
  textSecondary,
  textMuted,
  success,
  warning,
  info,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const TYPOGRAPHY = {
  screenTitle: { fontSize: 22, fontWeight: "700", color: textPrimary },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: textPrimary },
  cardTitle: { fontSize: 16, fontWeight: "700", color: textPrimary },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: textSecondary,
    letterSpacing: 0.2,
  },
  body: { fontSize: 15, fontWeight: "400", color: textPrimary },
  small: { fontSize: 12, fontWeight: "500", color: textSecondary },
  button: { fontSize: 15, fontWeight: "700", letterSpacing: 0.2 },
};

export const SHADOWS = {
  card: {
    shadowColor: "#0F172A",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fab: {
    shadowColor: "#0F172A",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
};

// ---- Unchanged (business logic — do not touch) ----
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

// export const COLORS = {
//   white: "#FFFFFF",
//   blue: "#1E6DE3",
//   lightGray: "#F2F5FA",
//   text: "#1E293B",
//   danger: "#DC2626",
// };

// export const API_BASE_URL =
//   process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
