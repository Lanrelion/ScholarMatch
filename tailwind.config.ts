import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:             'var(--color-bg)',
        surface:        'var(--color-surface)',
        'surface-hover':'var(--color-surface-hover)',
        ink:            'var(--color-ink)',
        'ink-secondary':'var(--color-ink-secondary)',
        moss:           'var(--color-moss)',
        'moss-light':   'var(--color-moss-light)',
        'moss-dark':    'var(--color-moss-dark)',
        clay:           'var(--color-clay)',
        'clay-light':   'var(--color-clay-light)',
        gold:           'var(--color-gold)',
        'gold-light':   'var(--color-gold-light)',
        border:         'var(--color-border)',
        'border-strong':'var(--color-border-strong)',
        urgent:         'var(--color-urgent)',
        warning:        'var(--color-warning)',
      },
      fontFamily: {
        editorial: 'var(--font-editorial)',
        ui:        'var(--font-ui)',
        mono:      'var(--font-mono)',
      },
      borderRadius: {
        sm:   'var(--radius-sm)',
        md:   'var(--radius-md)',
        lg:   'var(--radius-lg)',
        xl:   'var(--radius-xl)',
        pill: 'var(--radius-pill)',
      }
    },
  },
  plugins: [],
};
export default config;
