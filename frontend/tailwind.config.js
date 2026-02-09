const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  theme: {
    extend: {
      colors: {
        // Core theming colors
        accent: 'var(--theme-accent)',
        foreground: 'var(--theme-foreground)',
        background: 'var(--theme-background)',

        // Headings
        heading1: 'var(--theme-heading1)',
        heading2: 'var(--theme-heading2)',
        heading3: 'var(--theme-heading3)',
        heading4: 'var(--theme-heading4)',
        heading5: 'var(--theme-heading5)',
        heading6: 'var(--theme-heading6)',

        // Content-specific
        list: 'var(--theme-list)',
        link: 'var(--theme-link)',
        separator: 'var(--theme-separator)',

        // Notes and callouts
        note: 'var(--theme-note)',
        tip: 'var(--theme-tip)',
        important: 'var(--theme-important)',
        caution: 'var(--theme-caution)',
        warning: 'var(--theme-warning)',

        // Semantic base colors
        blue: 'var(--theme-blue)',
        green: 'var(--theme-green)',
        red: 'var(--theme-red)',
        yellow: 'var(--theme-yellow)',
        magenta: 'var(--theme-magenta)',
        cyan: 'var(--theme-cyan)',
      },

      fontFamily: {
        // Use fallback if var not defined
        sans: ['var(--theme-font)', 'system-ui', 'sans-serif'],
        mono: ['var(--theme-font)', 'monospace'],
      },

      spacing: {
        // Extra fine-tuned spacing values
        '4.5': '1.125rem',  // 18px
        '5.5': '1.375rem',  // 22px
        '6.5': '1.625rem',  // 26px
        '9.5': '2.375rem',  // 38px
        '13': '3.25rem',    // extra spacing for headings/panels
        '18': '4.5rem',
      },

      borderWidth: {
        3: '3px', // useful for thick separators
      },

      opacity: {
        8: '0.08', // low-opacity for overlays or shadows
        15: '0.15',
        85: '0.85',
      },

      outlineColor: {
        accent: 'var(--theme-accent)',
      },

      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.foreground'),

            a: {
              color: theme('colors.link'),
              fontWeight: '500',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            },

            h1: { color: theme('colors.heading1') },
            h2: { color: theme('colors.heading2') },
            h3: { color: theme('colors.heading3') },
            h4: { color: theme('colors.heading4') },
            h5: { color: theme('colors.heading5') },
            h6: { color: theme('colors.heading6') },

            hr: { borderColor: theme('colors.separator') },
            ul: { color: theme('colors.list') },
            strong: { color: theme('colors.important') },

            // Styled blockquotes
            blockquote: {
              color: theme('colors.note'),
              borderLeftWidth: '3px',
              borderLeftColor: theme('colors.accent'),
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              paddingLeft: theme('spacing.4'),
              paddingTop: theme('spacing.2'),
              paddingBottom: theme('spacing.2'),
              borderRadius: theme('borderRadius.md'),
              fontStyle: 'italic',
            },

            // Inline code styling
            code: {
              color: theme('colors.accent'),
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${theme('colors.separator')}`,
              borderRadius: theme('borderRadius.md'),
              padding: '0.15rem 0.35rem',
              fontFamily: theme('fontFamily.mono').join(', '),
            },

            pre: {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${theme('colors.separator')}`,
              borderRadius: theme('borderRadius.md'),
              padding: theme('spacing.4'),
              overflowX: 'auto',
              fontFamily: theme('fontFamily.mono').join(', '),
            },

            'pre code': {
              backgroundColor: 'transparent',
              border: 'none',
              padding: 0,
              fontFamily: theme('fontFamily.mono').join(', '),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
  ],
};