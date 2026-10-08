export const TOKENS = {
  colors: {
    dark: {
      background: "#07080c",
      surface1: "#0d101a",
      surface2: "#131724",
      surface3: "#1a2032",
      border: "#1e2538",
      borderSubtle: "#161c2a",
      borderStrong: "#2a344d",
      foreground: "#f3f4f6",
      muted: "#94a3b8",
      subtle: "#64748b",
      primary: "#f59e0b", // Pain doré / Or
      accent: "#3b82f6", // Linear blue
      success: "#10b981",
      warning: "#f59e0b",
      destructive: "#ef4444",
    },
    light: {
      background: "#f8fafc",
      surface1: "#ffffff",
      surface2: "#f1f5f9",
      surface3: "#e2e8f0",
      border: "#e2e8f0",
      borderSubtle: "#f1f5f9",
      borderStrong: "#cbd5e1",
      foreground: "#0f172a",
      muted: "#475569",
      subtle: "#64748b",
      primary: "#d97706",
      accent: "#2563eb",
      success: "#059669",
      warning: "#d97706",
      destructive: "#dc2626",
    },
  },
  typography: {
    display: "text-4xl md:text-5xl font-bold tracking-tight",
    h1: "text-2xl md:text-3xl font-bold tracking-tight",
    h2: "text-xl md:text-2xl font-semibold tracking-tight",
    h3: "text-lg font-semibold tracking-normal",
    body: "text-sm leading-relaxed",
    bodyMedium: "text-sm font-medium leading-relaxed",
    small: "text-xs leading-normal",
    caption: "text-[11px] font-mono leading-normal tracking-wide",
    label: "text-xs font-medium uppercase tracking-wider text-gray-400",
  },
  radius: {
    sm: "rounded-md", // 6px - petits contrôles, boutons compacts
    md: "rounded-lg", // 8px - inputs, selects, tabs
    lg: "rounded-xl", // 12px - cards, dialogs, dropdowns
    xl: "rounded-2xl", // 16px - grands containers, tiroirs
    full: "rounded-full",
  },
  shadows: {
    subtle: "shadow-sm shadow-black/20",
    elevated: "shadow-md shadow-black/40",
    modal: "shadow-2xl shadow-black/80",
    glow: "shadow-[0_0_20px_rgba(245,158,11,0.15)]",
  },
  transitions: {
    fast: "transition-all duration-150 ease-out",
    normal: "transition-all duration-200 ease-out",
    smooth: "transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1)",
  },
  zIndex: {
    dropdown: 50,
    sticky: 60,
    modalBackdrop: 70,
    modal: 80,
    commandMenu: 90,
    toast: 100,
  },
} as const;
