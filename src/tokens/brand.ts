export const tokens = {
  color: {
    brand: {
      primary: "#d2ff00",
      secondary: "#b2c73a",
      accent: "#ff6b00"
    },
    neutral: {
      0: "#ffffff",
      50: "#f4f4ed",
      100: "#ebeee0",
      200: "#dde1d2",
      300: "#c8cbbd",
      400: "#b9bbad",
      500: "#b4b8a5",
      700: "#535450",
      800: "#3b3c38",
      900: "#282c20",
      950: "#111112"
    },
    text: {
      heading: "#f4f4ed",
      body: "#ebeee0",
      muted: "#b4b8a5",
      link: "#d2ff00"
    },
    bg: {
      page: "#282c20",
      surface: "#111112",
      elevated: "#3b3c38"
    },
    semantic: {
      success: "#d2ff00",
      error: "#ff6b00",
      warning: "#b2c73a",
      info: "#c8cbbd"
    },
    gradient: {
      footer:
        "radial-gradient(circle farthest-corner at 50% -190%, rgba(210,255,0,0) 68%, #d2ff00 83%)",
      glow: "linear-gradient(90deg, rgba(210,255,0,0) 0%, rgba(210,255,0,0.18) 50%, rgba(210,255,0,0) 100%)"
    }
  },
  typography: {
    fontFamily: {
      heading: '"Mona Sans Variable", "Montserrat", sans-serif',
      body: '"Mona Sans Variable", "Montserrat", sans-serif',
      display: '"Brier", "Montserrat", serif',
      mono: '"SFMono-Regular", Menlo, Monaco, Consolas, "Courier New", monospace'
    },
    scale: {
      h1: {
        size: "4rem",
        weight: 800,
        lineHeight: 0.9,
        letterSpacing: "-0.02em"
      },
      h2: {
        size: "3rem",
        weight: 760,
        lineHeight: 0.92,
        letterSpacing: "-0.02em"
      },
      h3: {size: "2rem", weight: 700, lineHeight: 1, letterSpacing: "-0.01em"},
      h4: {
        size: "1.5rem",
        weight: 700,
        lineHeight: 1.08,
        letterSpacing: "-0.005em"
      },
      h5: {
        size: "1.2rem",
        weight: 700,
        lineHeight: 1.15,
        letterSpacing: "-0.004em"
      },
      h6: {size: "1rem", weight: 700, lineHeight: 1.2, letterSpacing: 0},
      bodyLg: {
        size: "1.25rem",
        weight: 500,
        lineHeight: 1.2,
        letterSpacing: "-0.01em"
      },
      body: {size: "1rem", weight: 500, lineHeight: 1.35, letterSpacing: 0},
      bodySm: {
        size: "0.875rem",
        weight: 500,
        lineHeight: 1.35,
        letterSpacing: 0
      },
      label: {
        size: "0.75rem",
        weight: 700,
        lineHeight: 1.2,
        letterSpacing: "0.05em"
      },
      overline: {
        size: "0.578125rem",
        weight: 700,
        lineHeight: 1.15,
        letterSpacing: "0.09em"
      }
    }
  },
  spacing: {
    4: "0.25rem",
    8: "0.5rem",
    12: "0.75rem",
    16: "1rem",
    20: "1.25rem",
    24: "1.5rem",
    32: "2rem",
    48: "3rem",
    64: "4rem",
    80: "5rem"
  },
  radius: {
    sm: "0.54rem",
    md: "1rem",
    lg: "3rem",
    xl: "6.25rem",
    full: "999px"
  },
  shadow: {
    sm: "0 10px 30px -15px rgba(0, 0, 0, 0.28)",
    md: "0 20px 30px -10px rgba(0, 0, 0, 0.35)",
    glow: "0 0 0 1px rgba(210, 255, 0, 0.28)"
  },
  motion: {
    duration: {
      fast: "0.2s",
      normal: "0.4s",
      slow: "0.75s"
    },
    easing: {
      default: "cubic-bezier(0.65, 0.05, 0, 1)",
      out: "cubic-bezier(0.19, 1, 0.22, 1)",
      linear: "linear"
    }
  },
  layout: {
    containerPadding: "1.25rem",
    containerMax: "120rem"
  }
} as const;

export type Tokens = typeof tokens;
